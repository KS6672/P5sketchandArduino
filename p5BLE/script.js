
// The serviceUuid must match the serviceUuid of the device you would like to connect
// https://www.uuidgenerator.net/
const serviceUuid = "";
let myBLE;
let isConnected = false;

let buttonCharacteristic;
let buttonValue;

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();

  createCanvas(200, 200);
  textSize(20);
  textAlign(CENTER, CENTER);

  // Create a 'Connect' button
  const connectButton = createButton('Connect')
  connectButton.mousePressed(connectToBle);

  // Create a 'Disconnect' button
  const disconnectButton = createButton('Disconnect')
  disconnectButton.mousePressed(disconnectToBle);
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function disconnectToBle() {
  // Disonnect to the device
  myBLE.disconnect();
  // Check if myBLE is connected
  isConnected = myBLE.isConnected();
}

function onDisconnected() {
  console.log('Device got disconnected.');
  isConnected = false;
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log('characteristics: ', characteristics);

  // Check if myBLE is connected
  isConnected = myBLE.isConnected();

  // Add a event handler when the device is disconnected
  myBLE.onDisconnected(onDisconnected)


  // assign characteristic and value read callback
  buttonCharacteristic = characteristics[0];
  // Read the value of the first characteristic
  myBLE.read(buttonCharacteristic, gotValue);
}

// A function that will be called once got values
function gotValue(error, value) {
  if (error) console.log('error: ', error);
  console.log('value: ', value);
  buttonValue = value;
  // After getting a value, call p5ble.read() again to get the value again
  myBLE.read(buttonCharacteristic, gotValue);
  // You can also pass in the dataType
  // Options: 'unit8', 'uint16', 'uint32', 'int8', 'int16', 'int32', 'float32', 'float64', 'string'
  // myBLE.read(myCharacteristic, 'string', gotValue);
}

function draw() {
  if (isConnected) {
    background(0, 255, 0);
    text('Connected!', 100, 10);
  } else {
    background(255, 0, 0);
    text('Disconnected :/', 100, 10);
  }

  if(buttonValue || buttonValue === 0){
    // Write value on the canvas
    text(buttonValue, 100, 100);
  }
}