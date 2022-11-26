void setup() {
  Serial.begin(9600); // initialize serial communications
}
 
void loop() {
  // read the input pin:
  int potentiometer = analogRead(A0);                  
  // remap the pot value to fit in 1 byte:
  int mappedPot = map(potentiometer, 0, 1023, 0, 255); 
  // print it out the serial port:
  Serial.println("Potentiometer");
  Serial.println(mappedPot);                             
  // slight delay to stabilize the ADC:
  delay(50);         

  int button =digitalRead(4);
  Serial.println("button");
  Serial.println(button);
  delay(50);                                   
}
