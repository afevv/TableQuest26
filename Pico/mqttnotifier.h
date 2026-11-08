// Pico W Wi-Fi and MQTT publisher for TableQuest notifications.
#pragma once

#include <cstdio>
#include <cstring>

#include "lwip/apps/mqtt.h"
#include "lwip/ip_addr.h"
#include "pico/cyw43_arch.h"
#include "pico/stdlib.h"
#include "secrets.h"

constexpr uint16_t BROKER_PORT = 1883;
constexpr uint32_t RETRY_MS = 5000;

#define NOTIFICATION_TOPIC "tablequest/" TABLEQUEST_DESK_ID "/notification"

class MqttNotifier {
public:
    bool init() {
        if (cyw43_arch_init() != 0) {
            std::printf("WiFi initialization failed\n");
            return false;
        }

        cyw43_arch_enable_sta_mode();
        if (!ipaddr_aton(MQTT_BROKER_IP, &brokerIp)) {
            std::printf("Invalid broker IP: %s\n", MQTT_BROKER_IP);
            return false;
        }

        cyw43_arch_lwip_begin();
        client = mqtt_client_new();
        cyw43_arch_lwip_end();

        if (!client) return false;
        connectWifi();
        return true;
    }

    // Non-blocking connection maintenance; safe to call from the OLED loop.
    void update() {
        if (!client) return;

        const uint32_t time = now();
        const int wifi = cyw43_wifi_link_status(&cyw43_state, CYW43_ITF_STA);

        if (wifi == CYW43_LINK_UP) {
            if (!wifiConnected) {
                wifiConnected = true;
                std::printf("WiFi connected\n");
            }
            if (!mqttConnected() && time - lastMqttTry >= RETRY_MS) {
                connectMqtt();
            }
            return;
        }

        wifiConnected = false;
        const bool failed = wifi == CYW43_LINK_DOWN ||
                            wifi == CYW43_LINK_FAIL ||
                            wifi == CYW43_LINK_NONET ||
                            wifi == CYW43_LINK_BADAUTH;
        if (failed && time - lastWifiTry >= RETRY_MS) connectWifi();
    }

    bool publish(const char* type) {
        if (!mqttConnected()) {
            std::printf("MQTT offline; notification skipped\n");
            return false;
        }

        char message[96];
        std::snprintf(
            message,
            sizeof(message),
            "{\"type\":\"%s\",\"desk_id\":\"%s\"}",
            type,
            TABLEQUEST_DESK_ID
        );

        cyw43_arch_lwip_begin();
        const err_t result = mqtt_publish(
            client,
            NOTIFICATION_TOPIC,
            message,
            std::strlen(message),
            1,  // QoS: delivered at least once
            0,  // Retain: this is a live event
            nullptr,
            nullptr
        );
        cyw43_arch_lwip_end();

        std::printf("MQTT publish: %s\n", result == ERR_OK ? "OK" : "ERROR");
        return result == ERR_OK;
    }

private:
    mqtt_client_t* client = nullptr;
    ip_addr_t brokerIp{};
    bool wifiConnected = false;
    uint32_t lastWifiTry = 0;
    uint32_t lastMqttTry = 0;

    static uint32_t now() {
        return to_ms_since_boot(get_absolute_time());
    }

    void connectWifi() {
        lastWifiTry = now();
        std::printf("Connecting to WiFi...\n");
        cyw43_arch_wifi_connect_async(
            WIFI_SSID,
            WIFI_PASSWORD,
            CYW43_AUTH_WPA2_AES_PSK
        );
    }

    bool mqttConnected() const {
        if (!client) return false;
        cyw43_arch_lwip_begin();
        const bool connected = mqtt_client_is_connected(client);
        cyw43_arch_lwip_end();
        return connected;
    }

    void connectMqtt() {
        lastMqttTry = now();
        mqtt_connect_client_info_t info{};
        info.client_id = "tablequest-pico-" TABLEQUEST_DESK_ID;
        info.keep_alive = 60;

        cyw43_arch_lwip_begin();
        mqtt_client_connect(
            client,
            &brokerIp,
            BROKER_PORT,
            onMqttConnection,
            nullptr,
            &info
        );
        cyw43_arch_lwip_end();
    }

    static void onMqttConnection(
        mqtt_client_t*,
        void*,
        mqtt_connection_status_t status
    ) {
        if (status == MQTT_CONNECT_ACCEPTED) std::printf("MQTT connected\n");
        else std::printf("MQTT disconnected (%d)\n", status);
    }
};
