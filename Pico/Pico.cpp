
// Pico.cpp - TableQuest Pico: starts every feature and runs them in the loop
#include "pico/stdlib.h"
#include "waternotification.h"




int main() {
    stdio_init_all();

    WaterNotification water;
    water.init();

    while (true) {
        water.update();
        sleep_ms(50);
    }
}