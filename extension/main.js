// We use the chrome api a lot so we will just define our access to the background scripts here:
let bg = chrome.extension.getBackgroundPage()

// This is a minor component that makes up our switches that will allow us to control the different ways we bypass paywalls:
Vue.component("switch-button", {
    template: 
    `<div class="switch-button-control">
        <div class="switch-button" :class="{ enabled: isEnabled }" @click="toggle" :style="{'--color': color}">
            <div class="button"></div>
        </div>
        <div class="switch-button-label">
            <slot></slot>
        </div>
    </div>`,

    // This describes how v-model will work 
    // by always keeping the state (whether by manually changing the value or by toggling the switch) synchronized
    model: {
      prop: "isEnabled",
      event: "toggle"
    },

    // There are two important things when determing how the switch looks:
    // First of all whether it is on or off
    // Second of all the overall color (which is set to grey by default)
    props: {
      isEnabled: Boolean,
      color: {
        type: String,
        required: false,
        default: "#4D4D4D"
      }
    },

    // Toggling is the one thing the switch can do reactively, by toggliing we emit an event
    methods: {
      toggle: function() {
        this.$emit("toggle", !this.isEnabled);
      }
    },
  });
  
  // This is our main component that brings everything together. 
  // If you wish to add more components, define them above.
  Vue.component("Master", {
    template:
    `<div>
        <h3>Vue Chrome Extension</h3>
            <h4>By: Shaun Regenbaum</h4>
            <h4>Bypass Paywalls on This Site?</h4>
            <switch-button v-model="switchValues.masterSwitch">
                <b v-if="switchValues.masterSwitch"> ON </b>
                <b v-else> OFF </b>
            </switch-button>
        <h3>Advanced Options (for bugs):</h3>
            <h4>Spoof as an Adbot?</h4>
            <switch-button v-model="switchValues.spoofSwitch">
                <b v-if="switchValues.spoofSwitch"> ON </b>
                <b v-else> OFF </b>
            </switch-button>
            <h4>Redirect Referer?</h4>
            <switch-button v-model="switchValues.redirectSwitch">
                <b v-if="switchValues.redirectSwitch"> ON </b>
                <b v-else> OFF </b>
            </switch-button>
            <h4>Keep Cookies?</h4>
            <switch-button v-model="switchValues.cookieSwitch ">
                <b v-if="switchValues.cookieSwitch"> ON </b>
                <b v-else> OFF </b>
            </switch-button>
            <h4>Keep JS?</h4>
            <switch-button v-model="switchValues.javascriptSwitch">
                <b v-if="switchValues.javascriptSwitch"> ON </b>
                <b v-else> OFF </b>
            </switch-button>
        </div>`,

        // Since we have five switches, we need to define five Boolean values.
        data: function () {
            return {
                switchValues: { 
                    masterSwitch: null,
                    spoofSwitch: null,
                    redirectSwitch: null,
                    cookieSwitch: null,
                    javascriptSwitch: null
                }
            }
        },

        // This lifecycle hook sets our initial switch values to which white/blacklists the current site is in:
        created: function () {
            console.log("Created");
            bg.getInitialSwitchValues().then(valuesDict => {console.log(valuesDict);})
            bg.getInitialSwitchValues().then(valuesDict => {
                console.log(valuesDict);
                this.switchValues.masterSwitch = valuesDict.blacklistDict;
                this.switchValues.spoofSwitch = valuesDict.spoofWhitelistDict;
                this.switchValues.redirectSwitch = valuesDict.redirectWhitelistDict;
                this.switchValues.cookieSwitch = valuesDict.cookieWhitelistDict;
                this.switchValues.javascriptSwitch = valuesDict.javascriptWhitelistDict;  
            });
           
 
        },

        // We only updates storage before the view is destroyed, we dont really need to do it earlier than that.
        beforeDestroy: function () {
            console.log("Saving to storage")
            bg.saveToStorage([
                this.switchValues.masterSwitch,
                this.switchValues.spoofSwitch,
                this.switchValues.redirectSwitch,
                this.switchValues.cookieSwitch,
                this.switchValues.javascriptSwitch
            ])
        },

        // Not sure if we need this, but well see, it may be causing problems?
        watch: {
            switchValues: {
                deep: true,
                handler () {
                    console.log("Saving to storage")
                    bg.saveToStorage([
                        this.switchValues.masterSwitch,
                        this.switchValues.spoofSwitch,
                        this.switchValues.redirectSwitch,
                        this.switchValues.cookieSwitch,
                        this.switchValues.javascriptSwitch
                    ])
                    chrome.tabs.reload()
                }
            }

        }
  })

  // This is our root Vue instance that simply calls our main components  
  new Vue({
    el: '#app',
  })
  
  