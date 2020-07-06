#!/bin/bash
export LC_ALL=C.UTF-8
export LANG=C.UTF-8
export FLASK_APP=/data/flask-react-portal/backend/src/main.py
flask run -h 0.0.0.0
