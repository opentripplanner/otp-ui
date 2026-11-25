import React from "react";

const LucyGreen = props => (
  <svg id="svg1" width={960} height={768} viewBox="0 0 960 768" {...props}>
    <defs id="defs1">
      <colorProfile
        name="sRGB IEC61966-2.1"
        xlinkHref="data:application/vnd.iccprofile;base64,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"
        id="color-profile1"
      />
      <clipPath clipPathUnits="userSpaceOnUse" id="clipPath46">
        <path
          d="M 0,576 H 720 V 0 H 0 Z"
          transform="translate(-251.99948,-82.7998)"
          id="path46"
        />
      </clipPath>
      <clipPath clipPathUnits="userSpaceOnUse" id="clipPath48">
        <path
          d="M 0,576 H 720 V 0 H 0 Z"
          transform="translate(-468.00001,-504.00001)"
          id="path48"
        />
      </clipPath>
      <clipPath clipPathUnits="userSpaceOnUse" id="clipPath50">
        <path
          d="M 0,576 H 720 V 0 H 0 Z"
          transform="translate(-358.77908,-410.93601)"
          id="path50"
        />
      </clipPath>
      <clipPath clipPathUnits="userSpaceOnUse" id="clipPath52">
        <path
          d="M 0,576 H 720 V 0 H 0 Z"
          transform="translate(-328.73708,-300.08621)"
          id="path52"
        />
      </clipPath>
      <clipPath clipPathUnits="userSpaceOnUse" id="clipPath54">
        <path
          d="M 0,576 H 720 V 0 H 0 Z"
          transform="translate(-422.84911,-205.73071)"
          id="path54"
        />
      </clipPath>
      <clipPath clipPathUnits="userSpaceOnUse" id="clipPath56">
        <path
          d="M 0,576 H 720 V 0 H 0 Z"
          transform="translate(-282.53761,-205.73071)"
          id="path56"
        />
      </clipPath>
      <clipPath clipPathUnits="userSpaceOnUse" id="clipPath58">
        <path
          d="M 0,576 H 720 V 0 H 0 Z"
          transform="translate(-397.47128,-157.95081)"
          id="path58"
        />
      </clipPath>
      <clipPath clipPathUnits="userSpaceOnUse" id="clipPath60">
        <path
          d="M 0,576 H 720 V 0 H 0 Z"
          transform="translate(-227.23471,-205.46721)"
          id="path60"
        />
      </clipPath>
      <clipPath clipPathUnits="userSpaceOnUse" id="clipPath62">
        <path d="M 0,576 H 720 V 0 H 0 Z" id="path62" />
      </clipPath>
    </defs>
    <g id="layer-MC0" transform="translate(-1960)">
      <path
        id="path45"
        d="m 0,0 c -113.147,0 -205.2,92.053 -205.2,205.2 0,113.148 92.053,205.2 205.2,205.2 H 216.001 C 329.148,410.4 421.2,318.348 421.2,205.2 421.2,92.053 329.148,0 216.001,0 Z"
        style={{
          fill: "#ffffff",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none"
        }}
        transform="matrix(1.3333333,0,0,-1.3333333,2295.9993,657.60027)"
        clipPath="url(#clipPath46)"
      />
      <path
        id="path47"
        d="m 0,0 h -216 c -119.293,0 -216,-96.707 -216,-216 0,-119.293 96.707,-216 216,-216 H 0 c 119.293,0 216,96.707 216,216 C 216,-96.707 119.293,0 0,0 m 0,-21.6 c 51.926,0 100.744,-20.221 137.461,-56.939 36.718,-36.717 56.939,-85.535 56.939,-137.461 0,-51.926 -20.221,-100.744 -56.939,-137.461 C 100.744,-390.179 51.926,-410.4 0,-410.4 h -216 c -51.926,0 -100.745,20.221 -137.461,56.939 -36.718,36.717 -56.939,85.535 -56.939,137.461 0,51.926 20.221,100.744 56.939,137.461 36.716,36.718 85.535,56.939 137.461,56.939 z"
        style={{
          fill: "#048945",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none"
        }}
        transform="matrix(1.3333333,0,0,-1.3333333,2584,96)"
        clipPath="url(#clipPath48)"
      />
      <path
        id="path49"
        d="m 0,0 c 12.467,6.356 24.781,13.036 37.427,19.013 53.718,25.384 111.737,-12.349 123.935,-62.616 14.159,-58.35 -31.63,-116.799 -91.497,-114.713 -25.559,0.891 -47.138,13.896 -68.242,27.099 10.182,6.696 20.365,13.392 30.547,20.087 11.851,-6.876 23.888,-13.66 37.933,-14.253 29.671,-1.252 56.024,21.379 60.495,51.392 4.315,28.962 -14.716,57.817 -43.004,66.145 -20.866,6.143 -38.138,-2.46 -55.357,-12.105 -10.719,-5.515 -21.19,-11.425 -30.527,-19.144 -12.968,-7.493 -24.498,-16.953 -37.247,-26.571 12.321,-9.151 23.98,-17.811 35.638,-26.47 -9.213,-7.582 -19.382,-13.624 -30.143,-18.714 -11.837,9.091 -23.809,18.013 -35.48,27.311 -16.93,13.488 -16.836,22.408 0.288,36.124 11.624,9.311 23.477,18.336 35.227,27.489 C -20.004,-13.284 -10.002,-6.642 0,0"
        style={{
          fill: "#f7d808",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none"
        }}
        transform="matrix(1.3333333,0,0,-1.3333333,2438.3721,220.08533)"
        clipPath="url(#clipPath50)"
      />
      <path
        id="path51"
        d="m 0,0 c 10.761,5.09 20.93,11.132 30.143,18.714 11.477,6.154 21.2,14.822 31.856,22.149 5.319,3.657 3.967,6.043 -0.426,9.151 C 51.531,57.117 41.68,64.491 31.752,71.755 41.089,79.474 51.56,85.384 62.281,90.9 74.986,80.798 87.835,70.872 100.349,60.54 112.878,50.194 112.863,40.318 100.344,30.043 87.792,19.742 74.935,9.813 62.212,-0.28 52.03,-6.976 41.847,-13.671 31.665,-20.367 18.241,-27 5.252,-34.413 -8.499,-40.501 c -56.145,-24.857 -121.927,21.139 -122.952,81.671 -0.849,50.125 31.079,88.295 80.506,96.196 13.682,2.187 26.63,-0.583 39.292,-5.241 C 3.074,126.706 17.009,119.638 30.041,110.85 20.04,104.208 10.038,97.565 0.036,90.924 c -6.095,3.075 -12.026,6.546 -18.314,9.155 -26.49,10.993 -54.335,2.643 -70.554,-20.887 -15.921,-23.097 -13.527,-54.57 5.686,-74.735 C -60.516,-19.296 -31.649,-20.844 0,0"
        style={{
          fill: "#048945",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none"
        }}
        transform="matrix(1.3333333,0,0,-1.3333333,2398.3161,367.88507)"
        clipPath="url(#clipPath52)"
      />
      <path
        id="path53"
        d="m 0,0 c 0,4.237 0.232,8.49 -0.055,12.707 -0.424,6.238 1.146,9.56 8.487,9.469 6.903,-0.086 8.119,-3.228 7.996,-9.03 -0.185,-8.794 -0.032,-17.606 0.314,-26.397 0.425,-10.789 7.77,-18.311 17.575,-18.44 9.92,-0.131 17.794,7.075 18.417,17.64 0.556,9.427 0.642,18.905 0.395,28.346 -0.159,6.112 2.42,7.919 8.151,7.804 5.341,-0.108 8.697,-1.032 8.384,-7.533 C 69.21,5.132 69.838,-4.36 69.258,-13.781 67.988,-34.376 53.439,-47.974 33.675,-47.597 14.837,-47.238 0.828,-32.727 0.089,-12.711 -0.068,-8.48 0.066,-4.237 0.066,0 0.044,0 0.022,0 0,0"
        style={{
          fill: "#048945",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none"
        }}
        transform="matrix(1.3333333,0,0,-1.3333333,2523.7988,493.6924)"
        clipPath="url(#clipPath54)"
      />
      <path
        id="path55"
        d="m 0,0 c 0,4.237 0.232,8.49 -0.055,12.707 -0.424,6.238 1.146,9.56 8.487,9.469 6.903,-0.086 8.119,-3.228 7.996,-9.03 -0.185,-8.794 -0.032,-17.606 0.314,-26.397 0.425,-10.789 7.77,-18.311 17.575,-18.44 9.92,-0.131 17.794,7.075 18.417,17.64 0.556,9.427 0.642,18.905 0.395,28.346 -0.159,6.112 2.42,7.919 8.151,7.804 5.341,-0.108 8.697,-1.032 8.384,-7.533 C 69.21,5.132 69.838,-4.36 69.258,-13.781 67.988,-34.376 53.439,-47.974 33.675,-47.597 14.837,-47.238 0.828,-32.727 0.089,-12.711 -0.068,-8.48 0.066,-4.237 0.066,0 0.044,0 0.022,0 0,0"
        style={{
          fill: "#048945",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none"
        }}
        transform="matrix(1.3333333,0,0,-1.3333333,2336.7168,493.6924)"
        clipPath="url(#clipPath56)"
      />
      <path
        id="path57"
        d="m 0,0 c -14.66,-0.802 -26.03,5.655 -32.827,19.214 -6.419,12.807 -4.9,25.359 3.602,36.844 9.79,13.225 23.988,14.395 38.766,13.56 6.251,-0.353 4.455,-5.269 4.646,-8.847 0.199,-3.718 0.077,-7.439 -5.283,-7.36 -3.587,0.054 -7.186,0.08 -10.763,-0.148 -10.775,-0.689 -17.989,-7.855 -18.215,-17.928 -0.239,-10.716 6.912,-18.447 17.913,-19.27 2.272,-0.17 4.577,-0.222 6.846,-0.054 5.902,0.438 9.799,-0.339 9.806,-8.084 0.007,-7.912 -4.21,-8.323 -9.943,-7.94 C 3.249,0.074 1.939,0 0,0"
        style={{
          fill: "#048945",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none"
        }}
        transform="matrix(1.3333333,0,0,-1.3333333,2489.9617,557.39893)"
        clipPath="url(#clipPath58)"
      />
      <path
        id="path59"
        d="m 0,0 c 0.001,4.239 0.17,8.486 -0.041,12.715 -0.273,5.461 0.227,9.262 7.519,9.363 7.679,0.106 8.404,-3.778 8.222,-9.747 -0.22,-7.164 0.052,-14.345 0.208,-21.517 0.342,-15.773 7.027,-22 22.956,-22.609 4.06,-0.155 10.574,3.522 11.786,-4.482 1.045,-6.895 0.251,-11.372 -9.164,-11.382 C 11.068,-47.688 -0.048,-35.382 0,0"
        style={{
          fill: "#048945",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none"
        }}
        transform="matrix(1.3333333,0,0,-1.3333333,2262.9796,494.04373)"
        clipPath="url(#clipPath60)"
      />
      <path
        id="path61"
        d="m 466.819,159.298 h -17.546 v -21.51 h 17.546 z"
        style={{
          fill: "#048945",
          fillOpacity: 1,
          fillRule: "nonzero",
          stroke: "none"
        }}
        transform="matrix(1.3333333,0,0,-1.3333333,1960,768)"
        clipPath="url(#clipPath62)"
      />
    </g>
    <g
      id="layer-MC1"
      style={{
        display: "none"
      }}
      transform="translate(-1960)"
    />
  </svg>
);
export default LucyGreen;
