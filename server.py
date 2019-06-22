#! /usr/bin/env python3

from flask import Flask, render_template, request
import json
import random
import math

server = Flask(__name__)


@server.route('/')
def root():
    return render_template("index.html")


@server.route('/generate', methods=['POST'])
def generate():

    if request.form.get("data"):

        data = json.loads(request.form.get("data"))

        npoints = int(data["npoints"])
        width_canvas = int(data["width_canvas"])
        height_canvas = int(data["height_canvas"])
        radius_point = int(data["radiusPoint"])

        response = []

        while npoints:
            x = random.randint(radius_point, width_canvas - radius_point)
            y = random.randint(radius_point, height_canvas - radius_point)
            response.append({"x": x, "y": y})
            npoints -= 1

        return json.dumps(response)
    else:
        return "Data is empty"


@server.route('/clast', methods=['POST'])
def clast():

    if request.form.get("data"):

        data = json.loads(request.form.get("data"))
        arrayPoints = data["arrayPoints"]
        arrayClasters = data["arrayClasters"]

        for claster in arrayClasters:
            claster['points'] = []

        delta = []
        response = arrayClasters
        for point in arrayPoints:
            for claster in arrayClasters:
                delta.append(
                    math.sqrt(
                        (
                            point['x']-claster['x']
                        )**2 + (
                            point['y']-claster['y']
                        )**2
                    )
                )
            minDelta = min(delta)
            index = delta.index(minDelta)
            response[index]['points'].append(point)
            delta = []

        response = avg(response)
        return json.dumps(response)
    else:
        return "Data is empty"


def avg(clasters):

    sumx = 0
    sumy = 0

    for claster in clasters:

        for point in claster['points']:

            if claster['points']:
                sumx += point['x']
                sumy += point['y']
            try:
                claster['x'] = round(sumx / len(claster['points']))
                claster['y'] = round(sumy / len(claster['points']))
            except ZeroDivisionError:
                print("Error: division by zero")
        sumx = 0
        sumy = 0

    return clasters


if __name__ == "__main__":
    server.run("localhost", 5900, True)
