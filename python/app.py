from flask import Flask, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/answer', methods=['POST'])
def process_image():
    file = request.files['image']
    # Save the image temporarily
    image_path = '/tmp/uploaded_image.png'
    file.save(image_path)

    # Process the image (same as your existing processing code)
    image = cv2.imread(image_path)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Define color ranges for segmentation
    lower_water = np.array([90, 50, 50])
    upper_water = np.array([140, 255, 255])
    water_mask = cv2.inRange(hsv, lower_water, upper_water)

    lower_urban = np.array([0, 0, 100])
    upper_urban = np.array([179, 50, 200])
    urban_mask = cv2.inRange(hsv, lower_urban, upper_urban)

    lower_green = np.array([30, 50, 50])
    upper_green = np.array([85, 255, 255])
    green_mask = cv2.inRange(hsv, lower_green, upper_green)

    lower_barren = np.array([10, 50, 50])
    upper_barren = np.array([30, 255, 255])
    barren_mask = cv2.inRange(hsv, lower_barren, upper_barren)

    combined_mask = cv2.bitwise_or(
        cv2.bitwise_or(water_mask, urban_mask),
        cv2.bitwise_or(green_mask, barren_mask)
    )

    # Calculate percentages
    total_pixels = image.shape[0] * image.shape[1]
    water_pixels = cv2.countNonZero(water_mask)
    urban_pixels = cv2.countNonZero(urban_mask)
    green_pixels = cv2.countNonZero(green_mask)
    barren_pixels = cv2.countNonZero(barren_mask)

    water_percentage = (water_pixels / total_pixels) * 100
    urban_percentage = (urban_pixels / total_pixels) * 100
    green_percentage = (green_pixels / total_pixels) * 100
    barren_percentage = (barren_pixels / total_pixels) * 100

    # Create a response with the percentages
    response = {
        'percentages': {
            'water': water_percentage,
            'urban': urban_percentage,
            'green': green_percentage,
            'land': barren_percentage
        },
        'colorizedImageUrl': '/path/to/colorized_image.png'  # Replace with actual image path
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
