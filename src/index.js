'use strict';

import Particle from 'particle-api-js';
import $  from 'jquery'

class Process {
    constructor() {
        this.particle = new Particle();
        this.access_token = null;
        this.refresh_token = null;
        this.devices = [];

        $("#login-form").on('submit', (e) => {
            e.preventDefault();
            var $inputs = $('#login-form :input');
            var values = {};
            $inputs.each(function () {
                values[this.name] = $(this).val();
            });
            this.login(values)
        });

        $("#device-form").on('submit', (e) => {
            e.preventDefault();
            var $children = $('#device-form').children();
            var values = {};
            $children.each(function () {
                if (this.name)
                    values[this.name] = $(this).val();
            });
            values.deviceId = $('#device-id').text();
            this.callTrt(values)
        })
    }

    login(args) {
        this.particle.login(args).then((res) => {
            this.access_token = res.body.access_token;
            this.refresh_token = res.body.refresh_token;
            this.fetchDevices(this.access_token)
        })
    }

    fetchDevices(access_token) {
        this.particle.listDevices({
            auth: access_token
        }).then((res) => {
            this.devices = res.body;
            this.renderDevices()
        })
    }

    renderDevices() {
        $('#device-list-section').show();
        $("#device-list").empty();
        this.devices.forEach((device) => {
            var $device = $('<li></li>');
            var $deviceLink = $('<a href="#"></a>');
            $deviceLink.text(device.name);
            $deviceLink.on('click', (e) => {
                e.preventDefault();
                this.onDeviceClick(device);
            });
            $device.append($deviceLink);
            $("#device-list").append($device)
        });
    }

    onDeviceClick(device) {
        $('#device-section').show();
        $("#device-form #device-name").text(device.name);
        $("#device-form #device-id").text(device.id);
    }

    callTrt(args) {
        var strColor = this.hexToRgb(args.color).join(',');
        this.particle.callFunction({
            deviceId: args.deviceId,
            name: "trt",
            argument: strColor,
            auth: this.access_token
        })
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
}


$(document).ready(function () {
    new Process()
});
