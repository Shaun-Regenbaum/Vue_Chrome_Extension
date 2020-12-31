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
    model: {
      prop: "isEnabled",
      event: "toggle"
    },
    props: {
      isEnabled: Boolean,
      color: {
        type: String,
        required: false,
        default: "#4D4D4D"
      }
    },
    methods: {
      toggle: function() {
        this.$emit("toggle", !this.isEnabled);
      }
    },

  });
  
  // This is our main component that brings everything together. 
  // If you wish to add more components, define them above.
  Vue.component("main", {
    template:
    `<h3>Vue Chrome Extension</h3>
        <h4>By: Shaun Regenbaum</h4>
        <h4>Bypass Paywalls on This Site?</h4>
        <switch-button v-model="masterSwitch">
            <b v-if="masterSwitch"> ON </b>
            <b v-else> OFF </b>
        </switch-button>
    <h3>Advanced Options (for bugs):</h3>
        <h4>Spoof as an Adbot?</h4>
        <switch-button v-model="spoofSwitch">
            <b v-if="spoofSwitch"> ON </b>
            <b v-else> OFF </b>
        </switch-button>
        <h4>Redirect Referer?</h4>
        <switch-button v-model="redirectSwitch">
            <b v-if="redirectSwitch"> ON </b>
            <b v-else> OFF </b>
        </switch-button>
        <h4>Block Cookies?</h4>
        <switch-button v-model="cookieSwitch ">
            <b v-if="cookieSwitch"> ON </b>
            <b v-else> OFF </b>
        </switch-button>
        <h4>Block JS?</h4>
        <switch-button v-model="javascriptSwitch">
            <b v-if="javascriptSwitch"> ON </b>
            <b v-else> OFF </b>
        </switch-button>`,
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

        // This lifecycle hook set our initial switch values to which white/blacklists the current site is in:
        created: function () {
            const { masterSwitch, spoofSwitch, redirectSwitch, cookieSwitch, javascriptSwitch } = bg.getInitialSwitchValues();
            this.switchValues.masterSwitch = masterSwitch;
            this.switchValues.spoofSwitch = spoofSwitch;
            this.switchValues.redirectSwitch = redirectSwitch;
            this.switchValues.cookieSwitch = cookieSwitch;
            this.switchValues.javascriptSwitch = javascriptSwitch;
        },

        beforeDestroyed: function () {
            bg.saveToStorage([
                this.switchValues.masterSwitch,
                this.switchValues.spoofSwitch,
                this.switchValues.redirectSwitch,
                this.switchValues.cookieSwitch,
                this.switchValues.javascriptSwitch
            ])
        },

        watch: {
            switchValues: {
                deep: true,
                handler () {
                    if (this.switchValues.masterSwitch == true) {
                        
                    }
                }

            }
        }
     
  })

  // This is our root Vue instance that simply calls our main components  
  new Vue({
    el: '#app',
    components: {
        main
    }
  })
  
  