# TableQuest26
group project

## Pico W water notifications

The live notification path is:

```text
Pico W --MQTT:1883--> Mosquitto --MQTT/WebSocket:9001--> React
```

This first version is live-only: it has no backend or notification history.

### 1. Start Mosquitto

Install Docker Desktop, open it, and run from the repository root:

```powershell
docker compose up -d
docker compose ps
```

The demo broker allows anonymous connections and must only be used on a temporary,
trusted private network. Stop it with `docker compose down`. Broker diagnostics are
available with `docker compose logs -f mosquitto`.

To simulate Pico boards without hardware, first enter the broker container:

```powershell
docker exec -it tablequest-mosquitto sh
```

Then publish from its shell. This avoids PowerShell changing the JSON quotes:

```sh
mosquitto_pub -h localhost -t tablequest/desk-01/notification -q 1 -m '{"type":"water","desk_id":"desk-01"}'
mosquitto_pub -h localhost -t tablequest/desk-02/notification -q 1 -m '{"type":"water","desk_id":"desk-02"}'
```

### 2. Configure and flash the Pico W

Copy `Pico/secrets.example.h` to `Pico/secrets.h`. Set the 2.4 GHz Wi-Fi credentials,
the PC's private IPv4 address from `ipconfig`, and a unique desk ID. Do not use
`localhost` as the broker address: on the Pico, localhost means the Pico itself.

Build and flash the Pico project using the Raspberry Pi Pico VS Code extension. USB
serial logs report Wi-Fi, MQTT connection, and publish status. The normal reminder
interval remains 45 minutes; temporarily shorten `INTERVAL_MS` only while testing.

If Windows Firewall blocks the Pico, allow inbound TCP port 1883 on the Private network
profile. Port 9001 is only needed by browsers running on another computer.

### 3. Run the website

From `frontend`, install and start the app:

```powershell
npm.cmd install
npm.cmd run dev
```

When the browser and Docker run on the same PC, the default `ws://localhost:9001`
works without configuration. Otherwise copy `frontend/.env.example` to
`frontend/.env`, replace localhost with the broker PC's private IPv4, and restart Vite.

Open any page and publish a test message. A water toast should appear immediately and
remain for up to one minute. Messages sent while the page is closed are not recovered.


To run frontend side:

1.step: In console write: cd frontend
(It moves you to a frontend folder)

2.step: In the console write: npm run dev
(It will compile the web page)


For frontend design components we use Tailwind with DaisyUI on to.

To access components go to : https://daisyui.com/, and in the menu select components.
There you can browse for all neccesary components and to add them to project- select JSX tab and copy the code, then put it into JSX file that you use.
