/*
 The BSD 3-Clause License

 Copyright 2016,2017 - Klaus Landsdorf (http://bianco-royal.de/)
 Copyright 2015,2016 - Mika Karaila, Valmet Automation Inc. (node-red-contrib-opcua)
 All rights reserved.
 node-red-iiot-opcua
 */
'use strict'

/**
 * Event Node-RED node.
 *
 * @param RED
 */
module.exports = function (RED) {
  let coreListener = require('./core/opcua-iiot-core-listener')

  function OPCUAIIoTEvent (config) {
    RED.nodes.createNode(this, config)
    this.eventRoot = config.eventRoot
    this.eventType = config.eventType
    this.queueSize = config.queueSize
    this.name = config.name

    let node = this

    node.on('input', function (msg) {
      let eventFields = coreListener.getBasicEventFields()

      switch (node.eventType) {
        case 'Condition':
          eventFields = coreListener.getBasicEventFields()
          break
        default:
          break
      }
      let eventFilter = coreListener.core.nodeOPCUA.constructEventFilter(eventFields)

      msg.topic = node.eventRoot
      msg.nodetype = 'events'

      msg.payload = {
        eventRoot: node.eventRoot,
        eventType: node.eventType,
        queueSize: node.queueSize,
        eventFilter: eventFilter,
        eventFields: eventFields
      }
      node.send(msg)
    })
  }

  RED.nodes.registerType('OPCUA-IIoT-Event', OPCUAIIoTEvent)

  // ObjectTypeIds via REST with Filter *EventType
}
