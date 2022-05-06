import bikeImage from "./static/bike.svg";
import carImage from "./static/car.svg";
import scooterImage from "./static/scooter.svg";

const commonModes = {
  transitModes: [
    {
      image: "https://trimet.org/global/img/mode-bus.png",
      mode: "BUS",
      label: "Bus"
    },
    {
      image: "https://trimet.org/global/img/mode-max.png",
      mode: "TRAM",
      label: "MAX & Portland Streetcar"
    },
    {
      image: "https://trimet.org/global/img/mode-wes.png",
      mode: "RAIL",
      label: "WES Trains régionaux"
    },
    {
      mode: "GONDOLA",
      label: "Télépherique",
      hidden: true
    }
  ],
  categories: [
    {
      description: "La petite reine",
      id: "BICYCLE",
      image: bikeImage,
      // 00A0 is non-breakable space used to prevent awkward breaking of "Bike Rental"
      label: `Vélo ou vélo${"\u00A0"}partagé`,
      type: "access",
      options: [
        {
          mode: "BICYCLE",
          label: "Vélo personnel"
        },
        {
          mode: "BICYCLE_RENT",
          label: "BIKETOWN",
          company: "BIKETOWN"
        }
      ]
    },
    {
      description: "Course en voiture",
      id: "CAR",
      image: carImage,
      // 00A0 is non-breakable space used to prevent awkward breaking of "Park & Ride"
      label: `Course en voiture ou Parc${"\u00A0"}relais`,
      type: "access",
      options: [
        {
          mode: "CAR_PARK",
          label: "Parc relais"
        },
        {
          company: "UBER", // Optional.
          image: "https://trimet-web.s3.amazonaws.com/uber.svg",
          label: "Uber",
          mode: "CAR_HAIL",
          url: "https://uber.com"
        }
      ]
    },
    {
      description: "Trottinette électrique",
      id: "SCOOTER",
      image: scooterImage,
      label: "Trottinette électrique partagée",
      type: "access",
      mode: "MICROMOBILITY_RENT",
      options: [
        {
          company: "BOLT",
          image: "https://trimet-web.s3.amazonaws.com/bolt.svg",
          label: "Bolt",
          url: "https://example.com"
        },
        {
          company: "BIRD",
          // image: "https://trimet-web.s3.amazonaws.com/bird.svg",
          label: "Bird",
          url: "https://example.com"
        },
        {
          company: "LIME",
          // image: "https://trimet-web.s3.amazonaws.com/lime.svg",
          label: "Lime",
          url: "https://example.com"
        },
        {
          company: "SPIN",
          image: "https://trimet-web.s3.amazonaws.com/spin.svg",
          label: "Spin",
          url: "https://example.com"
        }
      ]
    },
    {
      label: "À pied uniquement",
      id: "WALK",
      mode: "WALK",
      type: "exclusive"
    },
    {
      label: "En vélo uniquement",
      id: "BICYCLE",
      type: "exclusive",
      options: [
        {
          mode: "BICYCLE",
          label: "Vélo personnel"
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
      mode: "WALK",
      label: "Transports + Marche"
    },
    {
      mode: "BICYCLE",
      label: "Transports + Vélo personnel"
    },
    {
      mode: "BICYCLE_RENT",
      label: "Transports + Biketown"
      // No company required here.
      // If the user selects this, "companies" should default to Biketown.
    },
    {
      mode: "MICROMOBILITY_RENT",
      label: "Transports + Trottinette électrique"
    },
    {
      mode: "CAR_PARK",
      label: "Parc relais"
    },
    {
      mode: "CAR_HAIL",
      label: "Transports + Uber",
      company: "Uber" // Optional.
      // If not set and the user selects this, "companies" should default to Uber.
    },
    {
      mode: "CAR_RENT",
      showWheelchairSetting: true,
      label: "Transports + ReachNow",
      company: "ReachNow"
    },
    {
      mode: "CAR_RENT",
      showWheelchairSetting: true,
      label: "Transports + Car2Go",
      company: "Car2Go"
    }
  ],
  exclusiveModes: ["WALK", "BICYCLE", "MICROMOBILITY"],

  bicycleModes: [
    {
      mode: "BICYCLE",
      showWheelchairSetting: true,
      label: "Mon vélo"
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
      label: "Ma trottinette"
    },
    {
      mode: "MICROMOBILITY_RENT",
      label: "Trottinette en libre-service"
    }
  ]
};

export default commonModes;
