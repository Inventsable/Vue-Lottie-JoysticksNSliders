# Use Lottie and Joysticks and Sliders with Vue.js



## See `example.html`:

`<lottie-simple>` component accepts `classname` and `file` attributes, then initializes and runs itself in a single line of code:

> `<lottie-simple>` requires [lottie.js](https://github.com/airbnb/lottie-web) (bodymovin) and [vue.js](https://vuejs.org/)

```javascript
// Copy <lottie-simple> component, then use it in your own:
Vue.component('example', {
    template: `
        <site>
            <card>
                <lottie-simple classname="bmv-simple" file="logo" />
            </card>
        </site>
    `,
});
```

---

## See `index.html`:

`<joystick>` and `<lottie>` components create an HTML Joystick that performs identically to a [Joysticks N' Sliders](https://aescripts.com/joysticks-n-sliders/) layer inside After Effects:

> `<joystick>` and `<lottie>` requires [lottie.js](https://github.com/airbnb/lottie-web), [lottie-api](https://github.com/bodymovin/lottie-api), and [vue.js](https://vuejs.org/)

```javascript
Vue.component('example', {
    template: `
        <card>
            <joystick
                name="ballBounce"
                :bounds="300" 
                :controller="50" 
                :color="'#2b3137'"/>
            <lottie 
                file="ball" 
                joystick="ballBounce"
                layer="joystick"/>
                classname="lottie-container"
                :width="400" :height="125" 
        </card>
    `,
});
```

> Hold shift while hovering over joystick to control with mouse movement instead of click/drag

`<joystick>` parameters:

* `name`: Unique identifier for this joystick instance.
* `bounds`: Width/height of joystick bounds in pixels.
* `controller`: Width/height of joystick controller in pixels.

`<lottie>` parameters:

* `file`: Relative path to target `.json` file (e.g. `./hello`, `logo`, `../../simple`, etc.)
* `layer`: Name of Joystick controller/null layer within After Effects.
* `joystick`: Attribute `name` of corresponding `<joystick>` component.
* `width/height ? [classname]`: Specify width and height or classname (or both)

---

# To-do:

## general

* Color Collector AE helper extension
* Bodymovin Debugger AE helper extension
* Vue-Joystick Code Generator AE extension
* Add `<slider>` component
* Add `<turntable>` component (rotation control for slider)

## `<joystick>` updates

* Add bumper controls to push Joystick to each pose
* Add keyframe visualizers
* Add cycling arrows to move Joystick in sequence