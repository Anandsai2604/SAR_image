# import geemap
# import ee
# import numpy as np
# import matplotlib.pyplot as plt
# from PIL import Image
# import requests
# import tensorflow as tf
# from tensorflow.keras.preprocessing.image import img_to_array
# from skimage.metrics import peak_signal_noise_ratio as psnr
# from skimage.metrics import structural_similarity as ssim
# import sys
# # Authenticate and initialize Earth Engine
# ee.Authenticate()  # Ensure authentication
# ee.Initialize()

# # Load the trained generator model
# model_path = r"D:\dlvs\pix2pix_generator_urban.h5"
# generator = tf.keras.models.load_model(model_path)

# # Function to download and colorize SAR images based on latitude, longitude, and date range
# def download_and_colorize_sar_images(latitude, longitude, start_date, end_date):
#     # Load the Sentinel-1 SAR dataset (this is for radar imagery)
#     image_collection = ee.ImageCollection('COPERNICUS/S1_GRD') \
#         .filterBounds(ee.Geometry.Point(longitude, latitude)) \
#         .filterDate(start_date, end_date)  # Filter by date range

#     # Check if the collection is empty
#     if image_collection.size().getInfo() == 0:
#         print("No images found for the given date range.")
#         return

#     # Define visualization parameters for SAR imagery (VV and VH bands)
#     vis_params = {
#         'bands': ['VV', 'VH', 'VV'],  # Example: Use VV and VH polarization bands
#         'min': -25,
#         'max': 5,
#         'gamma': 1.4
#     }

#     # Loop through each image in the collection and process it
#     image_list = image_collection.toList(image_collection.size())  # Convert collection to list of images

#     for i in range(min(5, image_list.size().getInfo())):  # Display only 5 images
#         image = ee.Image(image_list.get(i))  # Get the ith image

#         # Get a thumbnail URL for the image (original SAR)
#         thumb_url = image.visualize(**vis_params).getThumbUrl({'dimensions': 512, 'format': 'png'})

#         # Use requests to download the image
#         response_orig = requests.get(thumb_url)

#         # Check if the response is valid
#         if response_orig.status_code == 200:
#             # Save the original SAR image
#             original_image_path = f'D:/project/SAR_IMAGE/backend/uploads/SAR_image_{i+1}_original.png'
#             with open(original_image_path, 'wb') as f:
#                 f.write(response_orig.content)

#             # Open the image using PIL and convert to RGB (for Pix2Pix)
#             img_orig = Image.open(original_image_path).convert("RGB")

#             # Resize the image to 256x256 (model input size)
#             img_resized = img_orig.resize((256, 256))

#             # Preprocess the image for Pix2Pix model
#             img_array = np.array(img_resized)
#             img_array = (img_array / 127.5) - 1  # Normalize to [-1, 1]

#             # Add batch dimension (Pix2Pix expects a batch of images)
#             img_array = np.expand_dims(img_array, axis=0)

#             # Generate colorized image using Pix2Pix
#             generated_image = generator(img_array, training=False)

#             # Convert generated image to [0, 255] range for display
#             generated_image_rgb = np.uint8((generated_image[0] + 1) * 127.5)

#             # Save colorized image
#             colorized_image_path = f'D:/project/SAR_IMAGE/backend/uploads/SAR_image_{i+1}_colorized.png'
#             Image.fromarray(generated_image_rgb).save(colorized_image_path)

#             # Display both original and colorized images
#             fig, ax = plt.subplots(1, 2, figsize=(12, 6))
#             ax[0].imshow(img_resized)
#             ax[0].set_title(f"Original SAR Image {i+1}")
#             ax[0].axis('off')

#             ax[1].imshow(generated_image_rgb)
#             ax[1].set_title(f"Colorized SAR Image {i+1}")
#             ax[1].axis('off')

#             plt.show()

#             print(f"Image {i+1} (original and colorized) saved and displayed successfully.")
#         else:
#             print(f"Error downloading image {i+1}. Status code: {response_orig.status_code}")

# # User input for latitude, longitude, and date range
# latitude = 7.8731
# longitude = 80.8818
# start_date = "2024-01-01"
# end_date = "2024-12-31"
# # latitude = float(sys.argv[1])
# # longitude = float(sys.argv[2])
# # start_date = str(sys.argv[3])
# # end_date = str(sys.argv[4])

# # Call the function to download and colorize SAR images
# download_and_colorize_sar_images(latitude, longitude, start_date, end_date)
# #4/1AanRRrtC6bgJQk2gsqUV7CeuS7YOFuswjaLeOld3UyYXDPfn5UXnjYC9UCw

# import geemap
# import ee
# import numpy as np
# import matplotlib.pyplot as plt
# from PIL import Image
# import requests
# import tensorflow as tf
# from tensorflow.keras.preprocessing.image import img_to_array
# import cv2

# # Initialize Earth Engine
# ee.Initialize()

# # Load the trained generator model
# model_path = r"D:\dlvs\pix2pix_generator_urban.h5"
# generator = tf.keras.models.load_model(model_path)

# # Function to download and colorize SAR images based on latitude, longitude, and date range
# def download_and_colorize_sar_images(latitude, longitude, start_date, end_date):
#     # Load the Sentinel-1 SAR dataset (this is for radar imagery)
#     image_collection = ee.ImageCollection('COPERNICUS/S1_GRD') \
#         .filterBounds(ee.Geometry.Point(longitude, latitude)) \
#         .filterDate(start_date, end_date)  # Filter by date range

#     # Check if the collection is empty
#     if image_collection.size().getInfo() == 0:
#         print("No images found for the given date range.")
#         return

#     # Define visualization parameters for SAR imagery (VV and VH bands)
#     vis_params = {
#         'bands': ['VV', 'VH', 'VV'],  # Example: Use VV and VH polarization bands
#         'min': -25,
#         'max': 5,
#         'gamma': 1.4
#     }

#     # Loop through each image in the collection and process it
#     image_list = image_collection.toList(image_collection.size())  # Convert collection to list of images

#     for i in range(min(5, image_list.size().getInfo())):  # Display only 5 images
#         image = ee.Image(image_list.get(i))  # Get the ith image

#         # Get a thumbnail URL for the image (original SAR)
#         thumb_url = image.visualize(**vis_params).getThumbUrl({'dimensions': 512, 'format': 'png'})

#         # Use requests to download the image
#         response_orig = requests.get(thumb_url)

#         # Check if the response is valid
#         if response_orig.status_code == 200:
#             # Save the original SAR image
#             original_image_path = f'D:/project/SAR_IMAGE/backend/uploads/SAR_image_{i+1}_original.png'
#             with open(original_image_path, 'wb') as f:
#                 f.write(response_orig.content)

#             # Open the image using PIL and convert to RGB (for Pix2Pix)
#             img_orig = Image.open(original_image_path).convert("RGB")

#             # Resize the image to 256x256 (model input size)
#             img_resized = img_orig.resize((256, 256))

#             # Preprocess the image for Pix2Pix model
#             img_array = np.array(img_resized)
#             img_array = (img_array / 127.5) - 1  # Normalize to [-1, 1]

#             # Add batch dimension (Pix2Pix expects a batch of images)
#             img_array = np.expand_dims(img_array, axis=0)

#             # Generate colorized image using Pix2Pix
#             generated_image = generator(img_array, training=False)

#             # Convert generated image to [0, 255] range for display
#             generated_image_rgb = np.uint8((generated_image[0] + 1) * 127.5)

#             # Save colorized image
#             colorized_image_path = f'D:/project/SAR_IMAGE/backend/uploads/SAR_image_{i+1}_colorized.png'
#             Image.fromarray(generated_image_rgb).save(colorized_image_path)

#             # Perform segmentation on the colorized image using OpenCV
#             image = cv2.cvtColor(generated_image_rgb, cv2.COLOR_RGB2BGR)

#             # Convert to HSV color space
#             hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

#             # Define color ranges for segmentation
#             # Water (blue-ish hues)
#             lower_water = np.array([90, 50, 50])
#             upper_water = np.array([140, 255, 255])
#             water_mask = cv2.inRange(hsv, lower_water, upper_water)

#             # Urban (grayish tones)
#             lower_urban = np.array([0, 0, 100])
#             upper_urban = np.array([179, 50, 200])
#             urban_mask = cv2.inRange(hsv, lower_urban, upper_urban)

#             # Green (vegetation/green-ish hues)
#             lower_green = np.array([30, 50, 50])
#             upper_green = np.array([85, 255, 255])
#             green_mask = cv2.inRange(hsv, lower_green, upper_green)

#             # Barren Land (brown/yellow-ish hues)
#             lower_barren = np.array([10, 50, 50])
#             upper_barren = np.array([30, 255, 255])
#             barren_mask = cv2.inRange(hsv, lower_barren, upper_barren)

#             # Combine masks to identify land (urban, green, barren)
#             land_mask = cv2.bitwise_or(
#                 cv2.bitwise_or(urban_mask, green_mask),
#                 barren_mask
#             )

#             # Count pixels
#             total_pixels = image.shape[0] * image.shape[1]
#             water_pixels = cv2.countNonZero(water_mask)
#             urban_pixels = cv2.countNonZero(urban_mask)
#             green_pixels = cv2.countNonZero(green_mask)
#             barren_pixels = cv2.countNonZero(barren_mask)
#             land_pixels = cv2.countNonZero(land_mask)

#             # Calculate percentage of each area
#             water_percentage = (water_pixels / total_pixels) * 100
#             urban_percentage = (urban_pixels / total_pixels) * 100
#             green_percentage = (green_pixels / total_pixels) * 100
#             barren_percentage = (barren_pixels / total_pixels) * 100

#             # Display only the SAR image, colorized image, and area percentages
#             fig, ax = plt.subplots(1, 2, figsize=(12, 6))
#             ax[0].imshow(img_orig)
#             ax[0].set_title(f"Original SAR Image {i+1}")
#             ax[0].axis('off')

#             ax[1].imshow(generated_image_rgb)
#             ax[1].set_title(f"Colorized SAR Image {i+1}\nWater: {water_percentage:.2f}%\nUrban: {urban_percentage:.2f}%\nGreen: {green_percentage:.2f}%\nBarren: {barren_percentage:.2f}%")
#             ax[1].axis('off')

#             # plt.show()

#         else:
#             print(f"Error downloading image {i+1}. Status code: {response_orig.status_code}")

# # User input for latitude, longitude, and date range
# latitude = 7.8731
# longitude = 80.7718
# start_date = "2024-01-01"
# end_date = "2024-12-31"

# # Call the function to download and colorize SAR images
# download_and_colorize_sar_images(latitude, longitude, start_date, end_date)

# import geemap
# import ee
# import numpy as np
# import matplotlib.pyplot as plt
# from PIL import Image
# import requests
# import tensorflow as tf
# from tensorflow.keras.preprocessing.image import img_to_array
# import cv2

# # Initialize Earth Engine
# ee.Initialize()

# # Load the trained generator model
# model_path = r"D:\dlvs\pix2pix_generator_urban.h5"
# generator = tf.keras.models.load_model(model_path)

# # Function to save and annotate the figure
# def save_annotated_image(img_orig, generated_image_rgb, i, water_percentage, urban_percentage, green_percentage, barren_percentage):
#     # Create the figure with subplots
#     fig, ax = plt.subplots(1, 2, figsize=(12, 6))
    
#     # Plot original SAR image
#     ax[0].imshow(img_orig)
#     ax[0].set_title(f"Original SAR Image {i+1}")
#     ax[0].axis('off')
    
#     # Plot colorized image with title annotation
#     ax[1].imshow(generated_image_rgb)
#     ax[1].set_title(
#         f"Colorized SAR Image {i+1}\n"
#         f"Water: {water_percentage:.2f}%\n"
#         f"Urban: {urban_percentage:.2f}%\n"
#         f"Green: {green_percentage:.2f}%\n"
#         f"Barren: {barren_percentage:.2f}%"
#     )
#     ax[1].axis('off')

#     # Save the figure to a file with title annotations
#     output_path = f'D:/project/SAR_IMAGE/backend/uploads/SAR_image_{i+1}_annotated.png'
#     plt.savefig(output_path, dpi=300, bbox_inches='tight')
#     plt.close(fig)  # Close the figure to free up memory
#     print(f"Annotated image saved as {output_path}")

# # Function to download and colorize SAR images based on latitude, longitude, and date range
# def download_and_colorize_sar_images(latitude, longitude, start_date, end_date):
#     # Load the Sentinel-1 SAR dataset (this is for radar imagery)
#     image_collection = ee.ImageCollection('COPERNICUS/S1_GRD') \
#         .filterBounds(ee.Geometry.Point(longitude, latitude)) \
#         .filterDate(start_date, end_date)  # Filter by date range

#     # Check if the collection is empty
#     if image_collection.size().getInfo() == 0:
#         print("No images found for the given date range.")
#         return

#     # Define visualization parameters for SAR imagery (VV and VH bands)
#     vis_params = {
#         'bands': ['VV', 'VH', 'VV'],  # Example: Use VV and VH polarization bands
#         'min': -25,
#         'max': 5,
#         'gamma': 1.4
#     }

#     # Loop through each image in the collection and process it
#     image_list = image_collection.toList(image_collection.size())  # Convert collection to list of images

#     for i in range(min(5, image_list.size().getInfo())):  # Display only 5 images
#         image = ee.Image(image_list.get(i))  # Get the ith image

#         # Get a thumbnail URL for the image (original SAR)
#         thumb_url = image.visualize(**vis_params).getThumbUrl({'dimensions': 512, 'format': 'png'})

#         # Use requests to download the image
#         response_orig = requests.get(thumb_url)

#         # Check if the response is valid
#         if response_orig.status_code == 200:
#             # Save the original SAR image
#             original_image_path = f'D:/project/SAR_IMAGE/backend/uploads/SAR_image_{i+1}_original.png'
#             with open(original_image_path, 'wb') as f:
#                 f.write(response_orig.content)

#             # Open the image using PIL and convert to RGB (for Pix2Pix)
#             img_orig = Image.open(original_image_path).convert("RGB")

#             # Resize the image to 256x256 (model input size)
#             img_resized = img_orig.resize((256, 256))

#             # Preprocess the image for Pix2Pix model
#             img_array = np.array(img_resized)
#             img_array = (img_array / 127.5) - 1  # Normalize to [-1, 1]

#             # Add batch dimension (Pix2Pix expects a batch of images)
#             img_array = np.expand_dims(img_array, axis=0)

#             # Generate colorized image using Pix2Pix
#             generated_image = generator(img_array, training=False)

#             # Convert generated image to [0, 255] range for display
#             generated_image_rgb = np.uint8((generated_image[0] + 1) * 127.5)

#             # Perform segmentation on the colorized image using OpenCV
#             image = cv2.cvtColor(generated_image_rgb, cv2.COLOR_RGB2BGR)

#             # Convert to HSV color space
#             hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

#             # Define color ranges for segmentation
#             # Water (blue-ish hues)
#             lower_water = np.array([90, 50, 50])
#             upper_water = np.array([140, 255, 255])
#             water_mask = cv2.inRange(hsv, lower_water, upper_water)

#             # Urban (grayish tones)
#             lower_urban = np.array([0, 0, 100])
#             upper_urban = np.array([179, 50, 200])
#             urban_mask = cv2.inRange(hsv, lower_urban, upper_urban)

#             # Green (vegetation/green-ish hues)
#             lower_green = np.array([30, 50, 50])
#             upper_green = np.array([85, 255, 255])
#             green_mask = cv2.inRange(hsv, lower_green, upper_green)

#             # Barren Land (brown/yellow-ish hues)
#             lower_barren = np.array([10, 50, 50])
#             upper_barren = np.array([30, 255, 255])
#             barren_mask = cv2.inRange(hsv, lower_barren, upper_barren)

#             # Count pixels
#             total_pixels = image.shape[0] * image.shape[1]
#             water_pixels = cv2.countNonZero(water_mask)
#             urban_pixels = cv2.countNonZero(urban_mask)
#             green_pixels = cv2.countNonZero(green_mask)
#             barren_pixels = cv2.countNonZero(barren_mask)

#             # Calculate percentage of each area
#             water_percentage = (water_pixels / total_pixels) * 100
#             urban_percentage = (urban_pixels / total_pixels) * 100
#             green_percentage = (green_pixels / total_pixels) * 100
#             barren_percentage = (barren_pixels / total_pixels) * 100

#             # Save the annotated image
#             save_annotated_image(
#                 img_orig=img_orig,
#                 generated_image_rgb=generated_image_rgb,
#                 i=i+1,
#                 water_percentage=water_percentage,
#                 urban_percentage=urban_percentage,
#                 green_percentage=green_percentage,
#                 barren_percentage=barren_percentage
#             )

#         else:
#             print(f"Error downloading image {i+1}. Status code: {response_orig.status_code}")

# # User input for latitude, longitude, and date range
# latitude = 7.8731
# longitude = 80.7718
# start_date = "2024-01-01"
# end_date = "2024-12-31"

# # Call the function to download and colorize SAR images
# download_and_colorize_sar_images(latitude, longitude, start_date, end_date)


import geemap
import ee
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import requests
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import cv2
import sys
# Initialize Earth Engine
ee.Initialize()

# Load the trained generator model
model_path = r"D:\dlvs\pix2pix_generator_urban.h5"
generator = tf.keras.models.load_model(model_path)

# Function to save and annotate the figure
def save_annotated_image(img_orig, generated_image_rgb, i, water_percentage, urban_percentage, green_percentage, barren_percentage):
    # Create the figure with subplots
    fig, ax = plt.subplots(1, 2, figsize=(12, 6))
    
    # Plot original SAR image
    ax[0].imshow(img_orig)
    ax[0].set_title(f"Original SAR Image {i}")
    ax[0].axis('off')
    
    # Plot colorized image with title annotation
    ax[1].imshow(generated_image_rgb)
    ax[1].set_title(
        f"Colorized SAR Image {i}\n"
        f"Water: {water_percentage:.2f}%\n"
        f"Urban: {urban_percentage:.2f}%\n"
        f"Green: {green_percentage:.2f}%\n"
        f"Barren: {barren_percentage:.2f}%"
    )
    ax[1].axis('off')

    # Save the figure to a file with title annotations
    output_path = f'D:/project/SAR_IMAGE/backend/uploads/SAR_images_{i}_annotated.png'
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close(fig)  # Close the figure to free up memory
    print(f"Annotated image saved as {output_path}")

# Function to normalize percentages
def normalize_percentages(water, urban, green, barren):
    total = water + urban + green + barren
    if total == 0:
        return 0, 0, 0, 0
    return (
        (water / total) * 100,
        (urban / total) * 100,
        (green / total) * 100,
        (barren / total) * 100
    )

# Function to download and colorize SAR images based on latitude, longitude, and date range
def download_and_colorize_sar_images(latitude, longitude, start_date, end_date):
    # Load the Sentinel-1 SAR dataset
    image_collection = ee.ImageCollection('COPERNICUS/S1_GRD') \
        .filterBounds(ee.Geometry.Point(longitude, latitude)) \
        .filterDate(start_date, end_date)

    # Check if the collection is empty
    if image_collection.size().getInfo() == 0:
        print("No images found for the given date range.")
        return

    # Define visualization parameters for SAR imagery
    vis_params = {
        'bands': ['VV', 'VH', 'VV'],
        'min': -25,
        'max': 5,
        'gamma': 1.4
    }

    # Loop through each image in the collection and process it
    image_list = image_collection.toList(image_collection.size())

    for i in range(min(5, image_list.size().getInfo())):
        image = ee.Image(image_list.get(i))

        # Get a thumbnail URL for the image
        thumb_url = image.visualize(**vis_params).getThumbUrl({'dimensions': 512, 'format': 'png'})

        # Use requests to download the image
        response_orig = requests.get(thumb_url)

        if response_orig.status_code == 200:
            # Save the original SAR image
            original_image_path = f'D:/project/SAR_IMAGE/backend/uploads/SAR_images_{i+1}_original.png'
            with open(original_image_path, 'wb') as f:
                f.write(response_orig.content)

            # Open the image using PIL and convert to RGB
            img_orig = Image.open(original_image_path).convert("RGB")

            # Resize the image to 256x256
            img_resized = img_orig.resize((256, 256))

            # Preprocess the image for Pix2Pix model
            img_array = np.array(img_resized)
            img_array = (img_array / 127.5) - 1  # Normalize to [-1, 1]
            img_array = np.expand_dims(img_array, axis=0)

            # Generate colorized image
            generated_image = generator(img_array, training=False)
            generated_image_rgb = np.uint8((generated_image[0] + 1) * 127.5)

            # Perform segmentation using OpenCV
            image = cv2.cvtColor(generated_image_rgb, cv2.COLOR_RGB2BGR)
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

            # Define color ranges for segmentation
            lower_water, upper_water = np.array([90, 50, 50]), np.array([140, 255, 255])
            lower_urban, upper_urban = np.array([0, 0, 100]), np.array([179, 50, 200])
            lower_green, upper_green = np.array([30, 50, 50]), np.array([85, 255, 255])
            lower_barren, upper_barren = np.array([10, 50, 50]), np.array([30, 255, 255])

            water_mask = cv2.inRange(hsv, lower_water, upper_water)
            urban_mask = cv2.inRange(hsv, lower_urban, upper_urban)
            green_mask = cv2.inRange(hsv, lower_green, upper_green)
            barren_mask = cv2.inRange(hsv, lower_barren, upper_barren)

            # Count pixels
            total_pixels = image.shape[0] * image.shape[1]
            water_pixels = cv2.countNonZero(water_mask)
            urban_pixels = cv2.countNonZero(urban_mask)
            green_pixels = cv2.countNonZero(green_mask)
            barren_pixels = cv2.countNonZero(barren_mask)

            # Normalize percentages
            water_percentage, urban_percentage, green_percentage, barren_percentage = normalize_percentages(
                water_pixels, urban_pixels, green_pixels, barren_pixels
            )

            # Save the annotated image
            save_annotated_image(
                img_orig=img_orig,
                generated_image_rgb=generated_image_rgb,
                i=i + 1,
                water_percentage=water_percentage,
                urban_percentage=urban_percentage,
                green_percentage=green_percentage,
                barren_percentage=barren_percentage
            )
        else:
            print(f"Error downloading image {i+1}. Status code: {response_orig.status_code}")

# User input for latitude, longitude, and date range
# latitude = 7.8731
# longitude = 80.7718
# start_date = "2024-01-01"
# end_date = "2024-12-31"
latitude =float(sys.argv[1])
longitude = float(sys.argv[2])
start_date = str(sys.argv[3])
end_date= str(sys.argv[4])
# Call the function to download and colorize SAR images
download_and_colorize_sar_images(latitude, longitude, start_date, end_date)
