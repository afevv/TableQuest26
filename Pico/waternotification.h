// waternotification.h - Water notification: every 45 min "WATER" blinks on the OLED for 1 min
#pragma once

#include "pico/stdlib.h"
#include "hardware/i2c.h"
#include <cstring>

// ---- Settings ----
constexpr uint32_t INTERVAL_MS = 45 * 60 * 1000;  // every 45 min
constexpr uint32_t SHOW_MS     = 60 * 1000;       // visible for 1 min
constexpr uint32_t BLINK_MS    = 500;             // on/off every 0.5 s

// ---- PicoBricks OLED (SSD1306 128x64) ----
constexpr uint SDA_PIN = 4;
constexpr uint SCL_PIN = 5;
constexpr uint8_t OLED_ADDR = 0x3C;

// Letters W, A, T, E, R (8x8, from the Raspberry Pi pico-examples font, BSD-3-Clause)
const uint8_t WATER_FONT[5][8] = {
    {0x7f, 0x20, 0x10, 0x08, 0x10, 0x20, 0x7f, 0x00},  // W
    {0x78, 0x14, 0x12, 0x11, 0x12, 0x14, 0x78, 0x00},  // A
    {0x01, 0x01, 0x01, 0x7f, 0x01, 0x01, 0x01, 0x00},  // T
    {0x7f, 0x49, 0x49, 0x49, 0x49, 0x49, 0x49, 0x00},  // E
    {0x7f, 0x11, 0x11, 0x11, 0x31, 0x51, 0x0e, 0x00},  // R
};

class WaterNotification {
public:
    void init() {
        i2c_init(i2c0, 400 * 1000);
        gpio_set_function(SDA_PIN, GPIO_FUNC_I2C);
        gpio_set_function(SCL_PIN, GPIO_FUNC_I2C);
        gpio_pull_up(SDA_PIN);
        gpio_pull_up(SCL_PIN);

        const uint8_t setup[] = {0xAE, 0x20, 0x00, 0x40, 0xA1, 0xA8, 63, 0xC8, 0xD3, 0x00,
                                 0xDA, 0x12, 0xD5, 0x80, 0xD9, 0xF1, 0xDB, 0x30, 0x81, 0xFF,
                                 0xA4, 0xA6, 0x8D, 0x14, 0x2E, 0xAF};
        for (uint8_t cmd : setup) sendCommand(cmd);

        drawWater(false);  // start with a clear screen
        lastStart = now();
    }

    // Call this all the time from the main loop
    void update() {
        uint32_t t = now();

        // 45 minutes passed -> start the notification
        if (!active && t - lastStart >= INTERVAL_MS) {
            active = true;
            started = true;
            lastStart = t;
        }

        if (active) {
            uint32_t elapsed = t - lastStart;
            if (elapsed >= SHOW_MS) {
                active = false;                              // 1 minute passed -> stop
                setVisible(false);
            } else {
                setVisible((elapsed / BLINK_MS) % 2 == 0);   // blink
            }
        }
    }

    // Returns true once for each newly started reminder.
    bool justStarted() {
        const bool result = started;
        started = false;
        return result;
    }

private:
    bool active = false;
    bool started = false;
    bool visible = false;
    uint32_t lastStart = 0;
    uint8_t screen[128 * 64 / 8];

    static uint32_t now() { return to_ms_since_boot(get_absolute_time()); }

    void sendCommand(uint8_t cmd) {
        uint8_t buf[2] = {0x80, cmd};
        i2c_write_blocking(i2c0, OLED_ADDR, buf, 2, false);
    }

    // Only redraw when it changes (on <-> off)
    void setVisible(bool on) {
        if (on != visible) drawWater(on);
    }

    void drawWater(bool on) {
        visible = on;
        memset(screen, 0, sizeof(screen));

        if (on) {
            const int scale = 3, startX = 4, startY = 20;    // big text, centred
            for (int letter = 0; letter < 5; letter++)
                for (int col = 0; col < 8; col++)
                    for (int row = 0; row < 8; row++)
                        if (WATER_FONT[letter][col] & (1 << row))
                            for (int dx = 0; dx < scale; dx++)
                                for (int dy = 0; dy < scale; dy++) {
                                    int x = startX + (letter * 8 + col) * scale + dx;
                                    int y = startY + row * scale + dy;
                                    screen[x + (y / 8) * 128] |= 1 << (y % 8);
                                }
        }

        // Send the whole screen to the OLED
        const uint8_t area[] = {0x21, 0, 127, 0x22, 0, 7};
        for (uint8_t cmd : area) sendCommand(cmd);
        static uint8_t data[sizeof(screen) + 1];
        data[0] = 0x40;
        memcpy(data + 1, screen, sizeof(screen));
        i2c_write_blocking(i2c0, OLED_ADDR, data, sizeof(data), false);
    }
};
