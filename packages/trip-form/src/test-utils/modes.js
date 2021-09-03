const commonModes = {
  transitModes: [
    {
      image: "https://trimet.org/global/img/mode-bus.png",
      mode: "BUS",
      label: "Buses"
    },
    {
      image: "https://trimet.org/global/img/mode-max.png",
      mode: "TRAM",
      label: "MAX and Portland Streetcar"
    },
    {
      image: "https://trimet.org/global/img/mode-wes.png",
      mode: "RAIL",
      label: "WES Commuter Rail"
    },
    {
      mode: "GONDOLA",
      label: "Aerial Tram",
      hidden: true
    }
  ],
  categories: [
    {
      description:
        "A bicycle, also called a bike or cycle, is a human-powered or motor-powered, pedal-driven, single-track vehicle, having two wheels attached to a frame, one behind the other. A bicycle rider is called a cyclist, or bicyclist.",
      id: "BICYCLE",
      image:
        "https://cdn.shopify.com/s/files/1/0514/3160/4395/files/ronin-titanium-natural-sram-red-axs_1024x.png?v=1617366397",
      // 00A0 is non-breakable space used to prevent awkward breaking of "Bike Rental"
      label: `+ Bike or Bike${"\u00A0"}Rental`,
      type: "access",
      options: [
        {
          mode: "BICYCLE",
          label: "Personal Bike"
        },
        {
          mode: "BICYCLE_RENT",
          label: "BIKETOWN"
        }
      ]
    },
    {
      description:
        "A ridesharing company (also known as a transportation network company, ride-hailing service; the vehicles are called app-taxis or e-taxis) is a company that, via websites and mobile apps, matches passengers with drivers of vehicles for hire that, unlike taxicabs, cannot legally be hailed from the street.",
      image:
        "https://www.enterprise.com/content/dam/global-vehicle-images/cars/FORD_FUSION_2020.png",
      // 00A0 is non-breakable space used to prevent awkward breaking of "Park & Ride"
      label: `+ Ridehail or Park${"\u00A0"}&${"\u00A0"}Ride`,
      type: "access",
      options: [
        {
          mode: "CAR_PARK",
          label: "Drive to Park & Ride"
        },
        {
          company: "Uber", // Optional.
          image: "https://trimet-web.s3.amazonaws.com/uber.svg",
          label: "Transit + Uber",
          mode: "CAR_HAIL",
          url: "https://uber.com"
        }
      ]
    },
    {
      description:
        "E-scooters are battery-powered devices that you can rent on-the-spot using an app on your phone. You can quickly and easily connect to and from your transit stop, using one of several scooter brands operating in the Portland area.",
      image:
        "https://help.bird.co/hc/article_attachments/360040546211/b1_image.png",
      label: "+ E-Scooter Rental",
      type: "access",
      mode: "MICROMOBILITY_RENT",
      options: [
        {
          company: "Bolt",
          image: "https://trimet-web.s3.amazonaws.com/bolt.svg",
          label: "Bolt",
          url: "https://example.com"
        },
        {
          company: "Bird",
          // image: "https://trimet-web.s3.amazonaws.com/bird.svg",
          label: "Bird",
          url: "https://example.com"
        },
        {
          company: "Lime",
          // image: "https://trimet-web.s3.amazonaws.com/lime.svg",
          label: "Lime",
          url: "https://example.com"
        },
        {
          company: "Spin",
          image: "https://trimet-web.s3.amazonaws.com/spin.svg",
          label: "Spin",
          url: "https://example.com"
        }
      ]
    },
    {
      label: "Walk only",
      mode: "WALK",
      type: "exclusive"
    },
    {
      label: "Bike only",
      type: "exclusive",
      options: [
        {
          mode: "BICYCLE",
          label: "Personal Bike"
        },
        {
          mode: "BICYCLE_RENT",
          label: "BIKETOWN"
        }
      ]
    }
  ],
  accessModes: [
    {
      mode: "BICYCLE",
      label: "Transit + Personal Bike"
    },
    {
      mode: "BICYCLE_RENT",
      label: "Transit + Biketown"
      // No company required here.
      // If the user selects this, "companies" should default to Biketown.
    },
    {
      mode: "MICROMOBILITY_RENT",
      label: "Transit + E-scooter"
    },
    {
      mode: "CAR_PARK",
      label: "Park & Ride"
    },
    {
      mode: "CAR_HAIL",
      label: "Transit + Uber",
      company: "Uber" // Optional.
      // If not set and the user selects this, "companies" should default to Uber.
    },
    {
      mode: "CAR_RENT",
      label: "Transit + ReachNow",
      company: "ReachNow"
    },
    {
      mode: "CAR_RENT",
      label: "Transit + Car2Go",
      company: "Car2Go"
    }
  ],
  exclusiveModes: ["WALK", "BICYCLE", "MICROMOBILITY"],

  bicycleModes: [
    {
      mode: "BICYCLE",
      label: "Own Bike"
    },
    {
      mode: "BICYCLE_RENT",
      label: "Biketown"
    }
  ],
  // Micromobility-only modes are not used with TriMet.
  micromobilityModes: [
    {
      mode: "MICROMOBILITY",
      label: "Own E-scooter"
    },
    {
      mode: "MICROMOBILITY_RENT",
      label: "Rental E-scooter"
    }
  ]
};

export default commonModes;
