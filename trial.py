import paho.mqtt.publish as publish

mqtt_broker_address = "192.168.1.16"
mqtt_channel = "your/command/channel"

message = "Hello, Raspberry Pi!"

publish.single(mqtt_channel, message, hostname=mqtt_broker_address)