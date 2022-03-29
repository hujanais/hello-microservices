#!/bin/bash
mongoimport --db InfoStore --collection users --file users.json --jsonArray
mongoimport --db InfoStore --collection products --file products.json --jsonArray