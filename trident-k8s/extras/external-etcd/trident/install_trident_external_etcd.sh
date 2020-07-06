#!/bin/bash

#$ ./install_trident.sh -h
#Usage:
# -n <namespace>:     Specifies the namespace for the Trident deployment; defaults to the current namespace.
# -i                  Enables the insecure mode to disable RBAC configuration for Trident.
# -h:                 Prints this usage guide.
#
#Example:
#  ./install_trident.sh -n trident		Installs the Trident deployment in namespace "trident".

usage() {
	printf "\nUsage:\n"
	printf " %-20s%s\n" "-n <namespace>" "Specifies the namespace for the Trident deployment; defaults to the current namespace."
	printf " %-20s%s\n" "-d" "Enables the debug mode for Trident."
	printf " %-20s%s\n" "-i" "Enables the insecure mode to disable RBAC configuration for Trident."
	printf " %-20s%s\n" "-h" "Prints this usage guide."
	printf "\nExample:\n"
	printf " %s\t\t%s\n\n" " ./install_trident.sh -n trident" "Installs the Trident deployment in namespace \"trident\"."
}

die() {
	usage
	exit 1
}

get_namespace() {
	TMP=$($CMD get serviceaccount default -o json | grep "namespace\":" | awk '{print $2}' | sed 's/,//g; s/"//g')
	echo $TMP
}

get_environment() {
	TMP=$(command -v oc > /dev/null 2>&1)
	if [ $? -ne 0 ]; then
		echo k8s
	else
		echo openshift
	fi
}

get_environment_version() {
	TMP=$($CMD version | grep "Server Version" | grep -oP '(?<=GitVersion:")[^"]+')
	echo $TMP
}

version_gt() {
    # Returns true if $1 > $2
    test "$(printf '%s\n' "$@" | sort -V | head -n 1)" != "$1";
}

# Process arguments
TMP=`getopt -o n:d,i,h -- "$@"`
if [ $? -ne 0 ]; then
	die
fi
eval set -- "$TMP"
while true ; do
	case "$1" in
		-n)
			NAMESPACE=$2
			shift 2 ;;
		-d)
			DEBUG="true"
			shift ;;
		-i)
			INSECURE="true"
			shift ;;
		-h)
			usage
			exit 0 ;;
		--) shift ; break ;;
		*)	die ;;
	esac
done

# Check for the requirements
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV=$(get_environment)
if [ "$ENV" == "k8s" ]; then
	CMD="kubectl"
	echo "Installer assumes you have deployed Kubernetes. If this is an OpenShift deployment, make sure 'oc' is in the \$PATH."
else
	CMD="oc"
	echo "Installer assumes you have deployed OpenShift."
fi
command -v curl > /dev/null 2>&1 || \
	{ echo >&2 "$0 requires curl present in \$PATH."; exit 1; }
command -v $CMD > /dev/null || \
	{ echo >&2 "$0 requires $CMD present in \$PATH."; exit 1; }

# Determine YAML files based on environment and version
VERSION=$(get_environment_version)
if version_gt "v1.8.0" $VERSION; then
    CLUSTER_ROLE_BINDINGS_YAML=$DIR/trident-clusterrolebindings-${ENV}-v1alpha1.yaml
    CLUSTER_ROLES_YAML=$DIR/trident-clusterroles-${ENV}-v1alpha1.yaml
else
    CLUSTER_ROLE_BINDINGS_YAML=$DIR/trident-clusterrolebindings-${ENV}.yaml
    CLUSTER_ROLES_YAML=$DIR/trident-clusterroles-${ENV}.yaml
fi

# Determine the namespace
if [ -z "$NAMESPACE" ]; then
	NAMESPACE=$(get_namespace)
	if [ -z "$NAMESPACE" ]; then
		echo >&2 "Failed to determine the current namespace!"; exit 1
	fi
	echo "You are running in namespace $NAMESPACE."
	echo "Trident will be deployed in namespace ${NAMESPACE}."
	if [ "$NAMESPACE" != "trident" ]
	then
		echo "For maximum security, we recommend running Trident in its own namespace: ./install_trident.sh -n trident"
	fi
fi

# Check if the namespace exists already
TMP=$($CMD get namespace $NAMESPACE 2>&1)
if [ "$?" -ne "0" ]; then
	sed -i -r "s/name: [a-z0-9]([-a-z0-9]*[a-z0-9])?/name: $NAMESPACE/g" $DIR/trident-namespace.yaml
	if [ $? -ne 0 ]; then
		exit 1;
	fi
	TMP=$($CMD create -f $DIR/trident-namespace.yaml 2>&1)
	if [ "$?" -ne "0" ]; then
		echo >&2 "Installer failed to create namespace ${NAMESPACE}: ${TMP}"; exit 1
	fi
fi

# Delete any previous state
if [ -z "$INSECURE" ]; then
	$CMD --namespace=$NAMESPACE delete -f $CLUSTER_ROLE_BINDINGS_YAML --ignore-not-found=true
	if [ $? -ne 0 ]; then
		exit 1;
	fi
	$CMD --namespace=$NAMESPACE delete -f $CLUSTER_ROLES_YAML --ignore-not-found=true
	if [ $? -ne 0 ]; then
		exit 1;
	fi
fi
$CMD --namespace=$NAMESPACE delete -f $DIR/trident-serviceaccounts.yaml --ignore-not-found=true
if [ $? -ne 0 ]; then
	exit 1;
fi
$CMD --namespace=$NAMESPACE delete configmap trident-launcher-config --ignore-not-found=true
if [ $? -ne 0 ]; then
	exit 1;
fi

# Create service accounts
$CMD --namespace=$NAMESPACE create -f $DIR/trident-serviceaccounts.yaml
if [ $? -ne 0 ]; then
	exit 1;
fi

if [ -z "$INSECURE" ]; then
	# Create cluster roles
	$CMD --namespace=$NAMESPACE create -f $CLUSTER_ROLES_YAML
	if [ $? -ne 0 ]; then
		exit 1;
	fi
	# Create cluster role bindings
	sed -i -r "s/namespace: [a-z0-9]([-a-z0-9]*[a-z0-9])?/namespace: $NAMESPACE/g" $CLUSTER_ROLE_BINDINGS_YAML
	if [ $? -ne 0 ]; then
		exit 1;
	fi
	$CMD --namespace=$NAMESPACE create -f $CLUSTER_ROLE_BINDINGS_YAML
	if [ $? -ne 0 ]; then
		exit 1;
	fi
fi

# Enable or disable the debug mode
if [ -z "$DEBUG" ]; then
	# Disable the debug mode for the Trident deployment
	sed -r -i 's/([[:space:]]+)- "-debug"/\1#- "-debug"/g' $DIR/trident-deployment-external-etcd.yaml
else
	# Enable the debug mode for the Trident deployment
	sed -r -i 's/([[:space:]]+)#- "-debug"/\1- "-debug"/g' $DIR/trident-deployment-external-etcd.yaml
fi

# Associate security context constraint 'anyuid' with service account 'trident' for OpenShift
if [ "$ENV" == "openshift" ]; then
	$CMD describe scc anyuid | grep trident > /dev/null
	if [ $? -ne 0 ]; then
		$CMD adm policy add-scc-to-user anyuid -z trident
		if [ $? -ne 0 ]; then
			exit 1;
		fi
	fi
fi

# Create Trident deployment
$CMD --namespace=$NAMESPACE create -f $DIR/trident-deployment-external-etcd.yaml
if [ $? -ne 0 ]; then
	exit 1;
fi

echo "Trident deployment definition is available in $DIR/trident-deployment-external-etcd.yaml."
echo "Started Trident in namespace \"$NAMESPACE\"."
