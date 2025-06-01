// Mapping function for server gestures to directional gestures
function mapGestureToDirection(serverGesture) {
  const gestureMapping = {
    palm: "stop",       // Example: "palm" means stop
    like: "up",         // Example: "fist" means up
    dis_like: "down",  // Example: "thumbs_up" means down
    stop: "right",      // Example: "wave" means right
    stop_inverted: "left",      // Example: "point" means left
  };
  

  return gestureMapping[serverGesture] || null; // Return mapped gesture or null if unmapped
}

async function getPredictedLabel(processed_t) {
  try {
    // Call the Flask API for prediction
    const response = await fetch('http://localhost:5000/get_prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ landmarks: processed_t }), // Send landmarks as JSON
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    const serverGesture = data.prediction; // Server returns gesture like "palm"
    console.log("Server gesture:", serverGesture);

    // Map server gesture to directional action
    const directionalGesture = mapGestureToDirection(serverGesture);
    console.log("Directional gesture:", directionalGesture);

    return directionalGesture;
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return null; // Return null to indicate "stop & wait" in case of an error
  }
}
