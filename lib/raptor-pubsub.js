/*
 * Copyright 2011 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Simple module to support decoupled communication using Pub/Sub communication.
 *
 * <h1>Overview</h1>
 * <p>
 * Pub/sub allows independent objects on a page to communicate by allowing publishers
 * to share information with subscribers by having subscribers publish messages
 * with a "topic name" that is agreed upon by the subscribers. The topic name
 * is simply a string value.  There are two key
 * methods for pub/sub and they are described below:
 * </p>
 *
 * <ul>
 *  <li>
 *      <b>publish(topic, props)</b><br>
 *      Publishes a message using the provided topic name. The properties in the props object, if provided, will be applied to the message that is published.
 *  </li>
 *  <li>
 *      <b>subscribe(topic, callbackFunction, thisObj)</b><br>
 *      Subscribes to messages on the provided topic.
 *      If a message is published to the provided topic then the provided callback function will be invoked. If the publisher of the message provides any argument object
 *      then argument object will be passed as arguments to the callback function (in order). In addition, the Message object will be provided after the arguments (see below).
 *  </li>
 * </ul>
 *
 * <h2>Usage:</h2>
 * <p>
 * <js>var pubsub = require('raptor/pubsub');
 * pubsub.subscribe('someTopic', function(message) {
 *     alert(message.myMessage); //Will alert "Hello World!"
 * });
 *
 * pubsub.publish('someTopic', {myMessage: 'Hello World!'});
 * </js>
 * </p>
 *
 * <h1>Private Pub/Sub Channels</h1>
 * <p>
 *
 * Pub/sub also supports private communication channels for messages. A private communication
 * channel can be obtained using <code>channel(channelName)</code> method.
 *
 * For channels to be effective, a set of publishers and subscribers would have to agree
 * on a channel name.
 * </p>
 *
 * <p>
 * <h2>Channel usage:</h2>
 * <js>var pubsub = require('raptor/pubsub');
 * var channel = pubsub.channel('myPrivateChannel');
 * channel.subscribe('someTopic', function(message) {
 *     alert(message.myMessage); //Will alert "Hello World!"
 * });
 *
 * channel.publish('someTopic', {myMessage: 'Hello World!'});
 * </js>
 * </p>
 *
 * <h1>Topics and Namespaces</h1>
 * <p>
 * A topic can be a simple topic such as "myTopic" or a namespaced topic such as "myTopic.mySubTopic". <b>Important:</b> Dots should be used to separate the topic parts.
 * The RaptorJS pubsub module supports wildcard topics when subscribing to topics.
 * </p>
 *
 * <p>
 * NOTE: The original topic can be accessed using a special message object that is passed in as the second argument to the listener function. The message data provided to the publish method will always be passed in as the first argument.
 * </p>
 *
 * <p>
 * <h2>Wildcard usage:</h2>
 * <js>var pubsub = require('raptor/pubsub');
 *
 * channel.subscribe('someTopic.*', function(data, message) {
 *     alert(data.myValue + " - " + message.getTopic());
 * });
 *
 * channel.publish('someTopic.a', {myValue: 'A'}); //Will result in alert("A - someTopic.a")
 * channel.publish('someTopic.b', {myValue: 'B'}); //Will result in alert("B - someTopic.b")
 * </js>
 * </p>
 *
 *
 */
'use strict';
var EventEmitter = require('events').EventEmitter;

var channels = {};

var globalChannel = new EventEmitter();
globalChannel.channel = function() {
    var channel;
    if (name) {
        channel = channels[name];
        if (!channel) {
            channel = new EventEmitter();
            channels[name] = channel;
        }
    } else {
        channel = new EventEmitter();
    }
    return channel;
};

module.exports = globalChannel;