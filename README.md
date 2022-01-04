# Clustering

A simple web application demonstrating clustering points by k-mean method 

![Иллюстрация к проекту](https://github.com/Vladimirch1397/clustering/raw/master/screenshots/screenshot.png)

## Usage

- npm install
- npm start
- go to localhost:3000

## Start with docker

- docker build -t clustering .
- docker run -d -p 3000:3000 --name clustering-container -t clustering
- go to localhost:3000

## How cluster the points

- Generate points. For example 1500 
- Select the centers of gravity from the rendered points
- Press cluster points
