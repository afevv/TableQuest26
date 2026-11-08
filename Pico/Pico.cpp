
// Pico.cpp - TableQuest Pico: starts every feature and runs them in the loop
#include "pico/stdlib.h"
#include "mqttnotifier.h"
#include "waternotification.h"




int main() {
    stdio_init_all();

    WaterNotification water;
    MqttNotifier mqtt;
    water.init();
    mqtt.init();

    while (true) {
        water.update();
        mqtt.update();
        if (water.justStarted()) {
            mqtt.publish("water");
        }
        sleep_ms(50);
    }
}
