#!/usr/bin/env python3
from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

# European style wheel ordering (same as frontend)
numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26]

@app.route('/spin', methods=['POST','GET'])
def spin():
    """Simulate a roulette spin and return landing index and number.

    This endpoint returns JSON: { resultIndex: <int>, number: <int> }
    """
    # Optionally accept a 'seed' to make results reproducible
    data = {}
    try:
        data = request.get_json(force=False) or {}
    except Exception:
        data = {}

    # If a user-supplied seed is provided, use it to generate a deterministic spin
    seed = data.get('seed') if isinstance(data, dict) else None
    if seed is not None:
        rnd = random.Random(seed)
        idx = rnd.randrange(len(numbers))
    else:
        idx = random.randrange(len(numbers))

    # Simulate a tiny bit of "thinking" to emulate server physics
    time.sleep(0.12)

    return jsonify({
        'resultIndex': idx,
        'number': numbers[idx]
    })

if __name__ == '__main__':
    print('Starting roulette server on http://0.0.0.0:5000')
    app.run(host='0.0.0.0', port=5000, debug=True)
