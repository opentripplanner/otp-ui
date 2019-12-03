export default {
  requestParameters: {
    date: "2019-11-18",
    mode: "WALK,BUS,TRAM,RAIL,GONDOLA",
    arriveBy: "false",
    walkSpeed: "1.34",
    ignoreRealtimeUpdates: "true",
    companies: "NaN",
    showIntermediateStops: "true",
    optimize: "QUICK",
    fromPlace:
      "3520 NE Broadway, Portland, OR, USA 97232::45.534701774459776,-122.62763465127287",
    toPlace: "SW Ravensview & Terrace::45.507525,-122.700325",
    time: "16:35",
    maxWalkDistance: "1207"
  },
  plan: {
    date: 1574123700000,
    from: {
      name: "3520 NE Broadway, Portland, OR, USA 97232",
      lon: -122.62763465127287,
      lat: 45.534701774459776,
      orig: "3520 NE Broadway, Portland, OR, USA 97232",
      vertexType: "NORMAL"
    },
    to: {
      name: "SW Ravensview & Terrace",
      lon: -122.700325,
      lat: 45.507525,
      orig: "SW Ravensview & Terrace",
      vertexType: "NORMAL"
    },
    itineraries: [
      {
        duration: 4720,
        startTime: 1574124154000,
        endTime: 1574128874000,
        walkTime: 941,
        transitTime: 3357,
        waitingTime: 422,
        walkDistance: 1166.9679552168075,
        walkLimitExceeded: false,
        elevationLost: 14.73999999999998,
        elevationGained: 17.169999999999987,
        transfers: 1,
        fare: {
          fare: {
            regular: {
              currency: {
                symbol: "$",
                currency: "USD",
                defaultFractionDigits: 2,
                currencyCode: "USD"
              },
              cents: 250
            }
          },
          details: {}
        },
        legs: [
          {
            startTime: 1574124154000,
            endTime: 1574124539000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 466.016,
            pathway: false,
            mode: "WALK",
            route: "",
            agencyTimeZoneOffset: -28800000,
            interlineWithPreviousLeg: false,
            from: {
              name: "3520 NE Broadway, Portland, OR, USA 97232",
              lon: -122.62763465127287,
              lat: 45.534701774459776,
              departure: 1574124154000,
              orig: "3520 NE Broadway, Portland, OR, USA 97232",
              vertexType: "NORMAL"
            },
            to: {
              name: "NE Sandy & Cesar Chavez Blvd",
              stopId: "TriMet:11313",
              stopCode: "11313",
              lon: -122.622754,
              lat: 45.535039,
              arrival: 1574124539000,
              departure: 1574124540000,
              zoneId: "B",
              stopIndex: 22,
              stopSequence: 23,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "}n|tGtumkVy@@D??Ac@AA}H?q@?k@?uA?U?Q?[?E?M?_@?iBAmB?O?u@ASL?BATMVCISGU",
              length: 26
            },
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: false,
            duration: 385,
            intermediateStops: [],
            steps: [
              {
                distance: 49.491,
                relativeDirection: "DEPART",
                streetName: "service road",
                absoluteDirection: "NORTH",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.62762443819214,
                lat: 45.53471487200395,
                elevation: [
                  {
                    first: 0,
                    second: 41.89284254544678
                  },
                  {
                    first: 10,
                    second: 42.03284254544678
                  },
                  {
                    first: 20,
                    second: 42.212842545446776
                  },
                  {
                    first: 28.79,
                    second: 42.20284254544678
                  },
                  {
                    first: 28.791,
                    second: 41.89284254544678
                  },
                  {
                    first: 38.791,
                    second: 41.98284254544678
                  },
                  {
                    first: 49.491,
                    second: 41.932842545446775
                  }
                ]
              },
              {
                distance: 360.30400000000003,
                relativeDirection: "RIGHT",
                streetName: "NE Broadway",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6276191,
                lat: 45.5351574,
                elevation: [
                  {
                    first: 0,
                    second: 41.932842545446775
                  },
                  {
                    first: 10,
                    second: 42.03284254544678
                  },
                  {
                    first: 20,
                    second: 42.13284254544678
                  },
                  {
                    first: 30,
                    second: 42.24284254544678
                  },
                  {
                    first: 40,
                    second: 42.27284254544678
                  },
                  {
                    first: 50,
                    second: 42.22284254544678
                  },
                  {
                    first: 60,
                    second: 42.24284254544678
                  },
                  {
                    first: 70,
                    second: 42.28284254544678
                  },
                  {
                    first: 80,
                    second: 42.36284254544678
                  },
                  {
                    first: 90,
                    second: 42.42284254544678
                  },
                  {
                    first: 100,
                    second: 42.45284254544678
                  },
                  {
                    first: 110,
                    second: 42.51284254544677
                  },
                  {
                    first: 124.07,
                    second: 42.58284254544678
                  },
                  {
                    first: 124.066,
                    second: 42.58284254544678
                  },
                  {
                    first: 134.066,
                    second: 42.77284254544678
                  },
                  {
                    first: 143.406,
                    second: 43.00284254544678
                  },
                  {
                    first: 143.405,
                    second: 43.00284254544678
                  },
                  {
                    first: 153.405,
                    second: 43.26284254544677
                  },
                  {
                    first: 161.035,
                    second: 43.44284254544678
                  },
                  {
                    first: 161.031,
                    second: 43.44284254544678
                  },
                  {
                    first: 171.031,
                    second: 43.69284254544678
                  },
                  {
                    first: 181.031,
                    second: 43.962842545446776
                  },
                  {
                    first: 191.031,
                    second: 44.072842545446775
                  },
                  {
                    first: 202.591,
                    second: 44.20284254544678
                  },
                  {
                    first: 223.11200000000002,
                    second: 44.48284254544678
                  },
                  {
                    first: 228.79200000000003,
                    second: 44.63284254544678
                  },
                  {
                    first: 228.79000000000002,
                    second: 44.63284254544678
                  },
                  {
                    first: 241.18,
                    second: 44.80284254544678
                  },
                  {
                    first: 241.175,
                    second: 44.80284254544678
                  },
                  {
                    first: 251.175,
                    second: 44.92284254544678
                  },
                  {
                    first: 261.175,
                    second: 45.05284254544678
                  },
                  {
                    first: 271.175,
                    second: 45.17284254544678
                  },
                  {
                    first: 282.265,
                    second: 45.28284254544678
                  },
                  {
                    first: 282.265,
                    second: 45.28284254544678
                  },
                  {
                    first: 292.265,
                    second: 45.34284254544678
                  },
                  {
                    first: 302.265,
                    second: 45.39284254544678
                  },
                  {
                    first: 312.265,
                    second: 45.49284254544678
                  },
                  {
                    first: 325.015,
                    second: 45.63284254544678
                  },
                  {
                    first: 325.019,
                    second: 45.63284254544678
                  },
                  {
                    first: 331.23900000000003,
                    second: 45.66284254544678
                  },
                  {
                    first: 331.242,
                    second: 45.66284254544678
                  },
                  {
                    first: 341.242,
                    second: 45.44284254544678
                  },
                  {
                    first: 351.242,
                    second: 45.49284254544678
                  },
                  {
                    first: 360.312,
                    second: 45.64284254544678
                  }
                ]
              },
              {
                distance: 36.624,
                relativeDirection: "RIGHT",
                streetName: "NE Cesar E. Chavez Blvd",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6229946,
                lat: 45.5351838,
                elevation: [
                  {
                    first: 0,
                    second: 45.64284254544678
                  },
                  {
                    first: 10,
                    second: 45.67284254544678
                  },
                  {
                    first: 20,
                    second: 45.51284254544677
                  },
                  {
                    first: 30,
                    second: 45.56284254544678
                  },
                  {
                    first: 36.64,
                    second: 45.52284254544678
                  }
                ]
              },
              {
                distance: 19.597,
                relativeDirection: "HARD_LEFT",
                streetName: "NE Sandy Blvd",
                absoluteDirection: "NORTHEAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6228985,
                lat: 45.5348661,
                elevation: []
              }
            ]
          },
          {
            startTime: 1574124540000,
            endTime: 1574125977000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 5259.940884073464,
            pathway: false,
            mode: "BUS",
            route: "12",
            agencyName: "TriMet",
            agencyUrl: "http://trimet.org/",
            agencyTimeZoneOffset: -28800000,
            routeType: 3,
            routeId: "TriMet:12",
            interlineWithPreviousLeg: false,
            tripBlockId: "1275",
            headsign: "Tigard TC via Portland City Center",
            agencyId: "TRIMET",
            tripId: "TriMet:9488308",
            serviceDate: "20191118",
            from: {
              name: "NE Sandy & Cesar Chavez Blvd",
              stopId: "TriMet:11313",
              stopCode: "11313",
              lon: -122.622754,
              lat: 45.535039,
              arrival: 1574124539000,
              departure: 1574124540000,
              zoneId: "B",
              stopIndex: 22,
              stopSequence: 23,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW 5th & Madison",
              stopId: "TriMet:7612",
              stopCode: "7612",
              lon: -122.679352,
              lat: 45.515682,
              arrival: 1574125977000,
              departure: 1574125977000,
              zoneId: "B",
              stopIndex: 39,
              stopSequence: 41,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "mp|tGxvlkVFTHR^nAj@fBFRFPPh@L^L^V~@@Tz@tCJZLNTr@\\hAx@rCdAhDPj@dAjD|@zCNd@Nd@FRN`@FTX|@J^Tv@d@bB`A~CDNRt@Nj@tA~ERp@`@tAHZTv@Lf@HRBJNd@n@|B@BPp@FRLb@\\lAh@lBNh@Ph@n@zB^rAj@pB\\rA\\hA@HL`@DNFRHTTr@j@lBdAvDFPDNZdAl@hBJb@`@zAX`ADTFP`@|A`@zAjAjEDRRr@FVf@jBx@xCHXHXFVd@|A^pALb@BZf@dB??HXDJ@F@H?F@B?J?D?\\?zB?hB?t@?L?\\AhE?hE?jEAhE?nD?X?pB?xA?RAjD?J?Z?dC?R?XAJ?P?R@H@FBFBFBDDDBBDBF@F?d@@H@D@FBDB@@@BBD@FBJ@LFTCjCEhHGzLAzAAxAG`LA`AAhC?LAnAGRAlBAXBhEBjE@fEVCJAF@F@b@NPHDBF@`A^D@JBJDhBx@NFNHfBt@JFxB`AJDNF~At@JDHBRHvAn@NHFBB@DBpBz@DBDBLFdBt@LJdCfAbCfA~Ap@",
              length: 200
            },
            interStopGeometry: [
              {
                points:
                  "mp|tGxvlkVFTHR^nAj@fBFRFPPh@L^L^V~@@Tz@tCJZLNTr@\\hAx@rCdAhDPj@",
                length: 20
              },
              {
                points: "{a|tGjzmkVdAjD|@zCNd@Nd@",
                length: 5
              },
              {
                points: "w|{tG~fnkVFRN`@FTX|@J^Tv@d@bB`A~CDNRt@",
                length: 11
              },
              {
                points: "yu{tGjxnkVNj@tA~ERp@`@tAHZTv@Lf@HRBJNd@n@|B",
                length: 12
              },
              {
                points: "am{tG~nokV@BPp@FRLb@\\lAh@lBNh@Ph@n@zB^rA",
                length: 11
              },
              {
                points: "}e{tGlapkVj@pB\\rA\\hA@H",
                length: 5
              },
              {
                points: "sb{tGfjpkVL`@DNFRHTTr@j@lBdAvDFPDNZdAl@hBJb@`@zA",
                length: 14
              },
              {
                points: "_yztGnbqkVX`ADTFP`@|A`@zAjAjEDRRr@",
                length: 9
              },
              {
                points: "mrztGftqkVFVf@jBx@xC",
                length: 4
              },
              {
                points: "coztGd}qkVHXHXFVd@|A^pALb@BZf@dB",
                length: 9
              },
              {
                points: "gjztGfjrkV??HXDJ@F@H?F@B?J?D?\\?zB?hB?t@",
                length: 14
              },
              {
                points: "qiztGvvrkV?L?\\AhE?hE?jEAhE?nD",
                length: 8
              },
              {
                points: "uiztG|vskV?X?pB?xA?RAjD?J?Z?dC",
                length: 9
              },
              {
                points:
                  "wiztGpitkV?R?XAJ?P?R@H@FBFBFBDDDBBDBF@F?d@@H@D@FBDB@@@BBD@FBJ@LFTCjCEhHGzLAzAAxAG`LA`AAhC?L",
                length: 37
              },
              {
                points: "ofztG~evkVAnAGRAlBAXBhEBjE@fEVCJAF@F@b@NPHDBF@`A^",
                length: 17
              },
              {
                points: "y`ztGfbwkVD@JBJDhBx@NFNHfBt@JFxB`AJDNF~At@JDHBRHvAn@",
                length: 17
              },
              {
                points: "elytGfmwkVNHFBB@DBpBz@DBDBLFdBt@LJdCfAbCfA~Ap@",
                length: 14
              }
            ],
            alerts: [
              {
                alertDescriptionText:
                  "For trips to Tigard Transit Center, no service to the stop at NE Sandy & 91st (Stop ID 5145) due to PBOT sidewalk construction. Use temporary stop on the west side of 91st.  ",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1564601290000
              },
              {
                alertDescriptionText:
                  "No service to the westbound stop at W Burnside & Burnside Bridge (Stop ID 689) due to long-term construction. Use temporary stop at W Burnside & 2nd (Stop ID 14057). ",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1553112419000
              },
              {
                alertDescriptionText:
                  "For trips to Parkrose/Sumner Transit Center, no service to the stop at NE Sandy & 47th (Stop ID 5094) due to long-term construction. Use the temporary stop located at NE Sandy & 48th (Stop ID 14073).",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1562950483000
              },
              {
                alertDescriptionText:
                  "Beginning at 3:30 a.m. on Monday, November 11, until end of service on Friday, November 22, no service to the eastbound stop at NE Sandy & 31st (Stop ID 5076) or the westbound stop at NE Sandy & 31st (Stop ID 5077) due to pedestrian crossing construction. ",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1573385400000
              },
              {
                alertDescriptionText:
                  "No service to the stops in both directions at SW Barbur & Lane (Stop IDs 176 and 177) due to construction. Use the temporary stops placed 100 feet past both closed stops.",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1569343132000
              }
            ],
            routeShortName: "12",
            routeLongName: "Barbur/Sandy Blvd",
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: true,
            duration: 1437,
            intermediateStops: [
              {
                name: "NE Sandy & 35th",
                stopId: "TriMet:5081",
                stopCode: "5081",
                lon: -122.628436,
                lat: 45.532691,
                arrival: 1574124654000,
                departure: 1574124654000,
                zoneId: "B",
                stopIndex: 23,
                stopSequence: 24,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 33rd",
                stopId: "TriMet:5080",
                stopCode: "5080",
                lon: -122.63045,
                lat: 45.531875,
                arrival: 1574124694000,
                departure: 1574124694000,
                zoneId: "B",
                stopIndex: 24,
                stopSequence: 25,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 31st",
                stopId: "TriMet:5077",
                stopCode: "5077",
                lon: -122.63324,
                lat: 45.530785,
                arrival: 1574124749000,
                departure: 1574124749000,
                zoneId: "B",
                stopIndex: 25,
                stopSequence: 26,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 28th",
                stopId: "TriMet:5069",
                stopCode: "5069",
                lon: -122.63686,
                lat: 45.52938,
                arrival: 1574124819000,
                departure: 1574124819000,
                zoneId: "B",
                stopIndex: 26,
                stopSequence: 27,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 26th",
                stopId: "TriMet:5068",
                stopCode: "5068",
                lon: -122.6398,
                lat: 45.528232,
                arrival: 1574124877000,
                departure: 1574124877000,
                zoneId: "B",
                stopIndex: 27,
                stopSequence: 28,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 24th",
                stopId: "TriMet:5067",
                stopCode: "5067",
                lon: -122.641209,
                lat: 45.527695,
                arrival: 1574124905000,
                departure: 1574124905000,
                zoneId: "B",
                stopIndex: 28,
                stopSequence: 29,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 20th",
                stopId: "TriMet:5063",
                stopCode: "5063",
                lon: -122.645089,
                lat: 45.526155,
                arrival: 1574124981000,
                departure: 1574124981000,
                zoneId: "B",
                stopIndex: 29,
                stopSequence: 30,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 18th",
                stopId: "TriMet:5062",
                stopCode: "5062",
                lon: -122.647926,
                lat: 45.525106,
                arrival: 1574125036000,
                departure: 1574125036000,
                zoneId: "B",
                stopIndex: 30,
                stopSequence: 31,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 16th",
                stopId: "TriMet:5060",
                stopCode: "5060",
                lon: -122.649367,
                lat: 45.524581,
                arrival: 1574125064000,
                departure: 1574125064000,
                zoneId: "B",
                stopIndex: 31,
                stopSequence: 32,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 14th",
                stopId: "TriMet:5058",
                stopCode: "5058",
                lon: -122.651428,
                lat: 45.523767,
                arrival: 1574125105000,
                departure: 1574125105000,
                zoneId: "B",
                stopIndex: 32,
                stopSequence: 33,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Couch & 12th",
                stopId: "TriMet:13328",
                stopCode: "13328",
                lon: -122.653391,
                lat: 45.523661,
                arrival: 1574125140000,
                departure: 1574125140000,
                zoneId: "B",
                stopIndex: 33,
                stopSequence: 34,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Couch & 7th",
                stopId: "TriMet:13329",
                stopCode: "13329",
                lon: -122.658549,
                lat: 45.523691,
                arrival: 1574125224000,
                departure: 1574125224000,
                zoneId: "B",
                stopIndex: 34,
                stopSequence: 35,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Couch & M L King",
                stopId: "TriMet:13330",
                stopCode: "13330",
                lon: -122.661524,
                lat: 45.523703,
                arrival: 1574125272000,
                departure: 1574125272000,
                zoneId: "B",
                stopIndex: 35,
                stopSequence: 36,
                vertexType: "TRANSIT"
              },
              {
                name: "W Burnside & Burnside Bridge",
                stopId: "TriMet:689",
                stopCode: "689",
                lon: -122.671007,
                lat: 45.52325,
                arrival: 1574125440000,
                departure: 1574125440000,
                zoneId: "B",
                stopIndex: 36,
                stopSequence: 38,
                vertexType: "TRANSIT"
              },
              {
                name: "SW 5th & Pine",
                stopId: "TriMet:7631",
                stopCode: "7631",
                lon: -122.675827,
                lat: 45.522236,
                arrival: 1574125661000,
                departure: 1574125661000,
                zoneId: "B",
                stopIndex: 37,
                stopSequence: 39,
                vertexType: "TRANSIT"
              },
              {
                name: "SW 5th & Morrison",
                stopId: "TriMet:7625",
                stopCode: "7625",
                lon: -122.677571,
                lat: 45.518932,
                arrival: 1574125860000,
                departure: 1574125860000,
                zoneId: "B",
                stopIndex: 38,
                stopSequence: 40,
                vertexType: "TRANSIT"
              }
            ],
            steps: []
          },
          {
            startTime: 1574125977000,
            endTime: 1574126100000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 161.843,
            pathway: false,
            mode: "WALK",
            route: "",
            agencyTimeZoneOffset: -28800000,
            interlineWithPreviousLeg: false,
            from: {
              name: "SW 5th & Madison",
              stopId: "TriMet:7612",
              stopCode: "7612",
              lon: -122.679352,
              lat: 45.515682,
              arrival: 1574125977000,
              departure: 1574125977000,
              zoneId: "B",
              stopIndex: 39,
              stopSequence: 41,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Salmon & 5th",
              stopId: "TriMet:5020",
              stopCode: "5020",
              lon: -122.678854,
              lat: 45.516794,
              arrival: 1574126100000,
              departure: 1574126520000,
              zoneId: "B",
              stopIndex: 30,
              stopSequence: 31,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points: "axxtGfywkV[Oi@UKGKEDW?AMGGE_Bq@MG?@G\\AB",
              length: 14
            },
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: false,
            duration: 123,
            intermediateStops: [],
            steps: [
              {
                distance: 49.484,
                relativeDirection: "DEPART",
                streetName: "SW 5th Ave (path)",
                absoluteDirection: "NORTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.67939029656335,
                lat: 45.51569192857994,
                elevation: [
                  {
                    first: 16.975,
                    second: 20.522842545446778
                  },
                  {
                    first: 26.975,
                    second: 20.32284254544678
                  },
                  {
                    first: 36.975,
                    second: 20.062842545446777
                  },
                  {
                    first: 42.155,
                    second: 19.93284254544678
                  },
                  {
                    first: 42.158,
                    second: 19.93284254544678
                  },
                  {
                    first: 49.488,
                    second: 19.71284254544678
                  }
                ]
              },
              {
                distance: 6.758,
                relativeDirection: "CONTINUE",
                streetName: "path",
                absoluteDirection: "NORTH",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.6791699,
                lat: 45.5161093,
                elevation: [
                  {
                    first: 0,
                    second: 19.71284254544678
                  },
                  {
                    first: 6.76,
                    second: 19.57284254544678
                  }
                ]
              },
              {
                distance: 11.29,
                relativeDirection: "RIGHT",
                streetName: "SW Main St",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6791398,
                lat: 45.5161663,
                elevation: [
                  {
                    first: 0,
                    second: 19.57284254544678
                  },
                  {
                    first: 11.29,
                    second: 19.25284254544678
                  }
                ]
              },
              {
                distance: 79.091,
                relativeDirection: "LEFT",
                streetName: "SW 5th Ave",
                absoluteDirection: "NORTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6790043,
                lat: 45.5161303,
                elevation: []
              },
              {
                distance: 15.22,
                relativeDirection: "LEFT",
                streetName: "SW Salmon St",
                absoluteDirection: "WEST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6786441,
                lat: 45.5167953,
                elevation: []
              }
            ]
          },
          {
            startTime: 1574126520000,
            endTime: 1574126580000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 283.1094417096907,
            pathway: false,
            mode: "BUS",
            route: "51",
            agencyName: "TriMet",
            agencyUrl: "http://trimet.org/",
            agencyTimeZoneOffset: -28800000,
            routeType: 3,
            routeId: "TriMet:51",
            interlineWithPreviousLeg: false,
            tripBlockId: "5106",
            headsign: "Council Crest and Dosch Rd",
            agencyId: "TRIMET",
            tripId: "TriMet:9493520",
            serviceDate: "20191118",
            from: {
              name: "SW Salmon & 5th",
              stopId: "TriMet:5020",
              stopCode: "5020",
              lon: -122.678854,
              lat: 45.516794,
              arrival: 1574126100000,
              departure: 1574126520000,
              zoneId: "B",
              stopIndex: 30,
              stopSequence: 31,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW 2nd & Taylor",
              stopId: "TriMet:7098",
              stopCode: "7098",
              lon: -122.67524,
              lat: 45.51653,
              arrival: 1574126580000,
              departure: 1574127360000,
              zoneId: "B",
              stopIndex: 31,
              stopSequence: 32,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points: "g_ytGtuwkVHa@?ABOn@wDFYf@yCFWr@eEMEaBu@",
              length: 11
            },
            interStopGeometry: [
              {
                points: "g_ytGtuwkVHa@?ABOn@wDFYf@yCFWr@eEMEaBu@",
                length: 11
              }
            ],
            routeShortName: "51",
            routeLongName: "Vista",
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: true,
            duration: 60,
            intermediateStops: [],
            steps: []
          },
          {
            startTime: 1574127360000,
            endTime: 1574128440000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 4383.940381026675,
            pathway: false,
            mode: "BUS",
            route: "51",
            agencyName: "TriMet",
            agencyUrl: "http://trimet.org/",
            agencyTimeZoneOffset: -28800000,
            routeType: 3,
            routeId: "TriMet:51",
            interlineWithPreviousLeg: true,
            tripBlockId: "5106",
            headsign: "Council Crest and Dosch Rd",
            agencyId: "TRIMET",
            tripId: "TriMet:9493503",
            serviceDate: "20191118",
            from: {
              name: "SW 2nd & Taylor",
              stopId: "TriMet:7098",
              stopCode: "7098",
              lon: -122.67524,
              lat: 45.51653,
              arrival: 1574126580000,
              departure: 1574127360000,
              zoneId: "B",
              stopIndex: 0,
              stopSequence: 1,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Vista & Broadway",
              stopId: "TriMet:6068",
              stopCode: "6068",
              lon: -122.703903,
              lat: 45.505533,
              arrival: 1574128440000,
              departure: 1574128441000,
              zoneId: "B",
              stopIndex: 21,
              stopSequence: 22,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "m}xtGz_wkVGCMGKEiBw@GCQKwB_ACAuB}@MGOI_@OIEYOa@QMEETERWxAEVId@w@lEg@xCKh@ABw@rEADs@~Ds@fE[fBSjAERWxAAFg@rCOv@LF`Bt@HBLFHDtB~@CTe@lCKh@ERm@rDGZ_@zBI`@EVERi@~CCLO`AO|@G\\EPCNG\\i@|CCLERi@|CEVLRh@TRHh@ZXNhBv@JFJFRJFDFFFH@@`@XFDh@b@RNa@zBWvAq@|DSfACNKj@[hBa@|Bo@A@dC?^?lA?b@?x@?j@?p@?`CLAN?P?|A?J?vB@@?@?FCD?BCHCBCTKnFmCJGJGJE`@W^[PSHGBEBEFMXi@HSBEFEDEFCJEnAa@vAg@LCFADAD@F@FBDDHHHTX`AJXBHPZHJFHPLf@b@p@d@DDFDB?B?D?DABCBCDIBGBIXaBBIDKBGDGBEHGDCFCDADAFADAD@F@H@HDbBt@lElB^PtB~@vB`ALFdCfArB|@NHHBhBz@LHHJBFBF@H@JBt@@HBDbAdBNXBF?D@LLdD@j@B^VtC@^@P?`@MhA@RBN@FPRf@h@BFDH@HBJB^?F@FBDDDB@H@D?^QlBEPAxBIzDs@HC",
              length: 236
            },
            interStopGeometry: [
              {
                points:
                  "m}xtGz_wkVGCMGKEiBw@GCQKwB_ACAuB}@MGOI_@OIEYOa@QMEETERWxAEV",
                length: 21
              },
              {
                points: "apytGl{vkVId@w@lEg@xC",
                length: 4
              },
              {
                points: "ksytGzgwkVKh@ABw@rEADs@~Ds@fE[fBSjA",
                length: 9
              },
              {
                points: "kzytG~axkVERWxAAFg@rCOv@LF`Bt@",
                length: 8
              },
              {
                points: "syytG~mxkVHBLFHDtB~@CTe@lC",
                length: 7
              },
              {
                points: "evytGtuxkVKh@ERm@rDGZ_@zB",
                length: 6
              },
              {
                points: "myytG~aykVI`@EVERi@~CCLO`AO|@G\\",
                length: 9
              },
              {
                points: "y|ytGxnykVEPCNG\\i@|CCLERi@|CEVLRh@T",
                length: 11
              },
              {
                points: "w~ytGx}ykVRHh@ZXNhBv@JFJFRJFDFFFH@@`@XFD",
                length: 14
              },
              {
                points: "euytG|czkVh@b@RNa@zBWvAq@|DSfA",
                length: 7
              },
              {
                points: "gwytGjtzkVCNKj@[hBa@|Bo@A@dC?^?lA",
                length: 9
              },
              {
                points: "c{ytG`e{kV?b@?x@?j@?p@?`CLAN?P?",
                length: 9
              },
              {
                points: "syytG|n{kV|A?J?vB@@?",
                length: 5
              },
              {
                points: "orytG~n{kV@?FCD?BCHCBCTKnFmC",
                length: 9
              },
              {
                points:
                  "giytGti{kVJGJGJE`@W^[PSHGBEBEFMXi@HSBEFEDEFCJEnAa@vAg@LCFADAD@F@FBDDHHHTX`AJX",
                length: 31
              },
              {
                points:
                  "qyxtGrd{kVBHPZHJFHPLf@b@p@d@DDFDB?B?D?DABCBCDIBGBIXaBBIDKBGDGBEHGDCFCDADAFADAD@F@H@HDbBt@lElB^P",
                length: 39
              },
              {
                points: "mdxtGhi{kVtB~@vB`A",
                length: 3
              },
              {
                points: "_}wtGjm{kVLFdCfArB|@",
                length: 4
              },
              {
                points: "wtwtGxq{kVNHHBhBz@LHHJBFBF@H@JBt@@HBDbAdBNXBF?D@LLdD",
                length: 19
              },
              {
                points:
                  "}kwtGfb|kV@j@B^VtC@^@P?`@MhA@RBN@FPRf@h@BFDH@HBJB^?F@FBDDDB@H@D?^QlBE",
                length: 27
              },
              {
                points: "ecwtG`t|kVPAxBIzDs@HC",
                length: 5
              }
            ],
            routeShortName: "51",
            routeLongName: "Vista",
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: true,
            duration: 1080,
            intermediateStops: [
              {
                name: "SW Washington & 3rd",
                stopId: "TriMet:6158",
                stopCode: "6158",
                lon: -122.674554,
                lat: 45.519574,
                arrival: 1574127464000,
                departure: 1574127464000,
                zoneId: "B",
                stopIndex: 1,
                stopSequence: 2,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Washington & 5th",
                stopId: "TriMet:6160",
                stopCode: "6160",
                lon: -122.676586,
                lat: 45.520126,
                arrival: 1574127508000,
                departure: 1574127508000,
                zoneId: "B",
                stopIndex: 2,
                stopSequence: 3,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Washington & 9th",
                stopId: "TriMet:6169",
                stopCode: "6169",
                lon: -122.680765,
                lat: 45.521236,
                arrival: 1574127600000,
                departure: 1574127600000,
                zoneId: "B",
                stopIndex: 3,
                stopSequence: 4,
                vertexType: "TRANSIT"
              },
              {
                name: "SW 11th & Alder",
                stopId: "TriMet:9600",
                stopCode: "9600",
                lon: -122.682819,
                lat: 45.521094,
                arrival: 1574127655000,
                departure: 1574127655000,
                zoneId: "B",
                stopIndex: 4,
                stopSequence: 5,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Morrison & 12th",
                stopId: "TriMet:9598",
                stopCode: "9598",
                lon: -122.683933,
                lat: 45.52055,
                arrival: 1574127698000,
                departure: 1574127698000,
                zoneId: "B",
                stopIndex: 5,
                stopSequence: 6,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Morrison & 14th",
                stopId: "TriMet:9708",
                stopCode: "9708",
                lon: -122.685888,
                lat: 45.521078,
                arrival: 1574127743000,
                departure: 1574127743000,
                zoneId: "B",
                stopIndex: 6,
                stopSequence: 7,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Morrison & 16th",
                stopId: "TriMet:9613",
                stopCode: "9613",
                lon: -122.687932,
                lat: 45.521641,
                arrival: 1574127790000,
                departure: 1574127790000,
                zoneId: "B",
                stopIndex: 7,
                stopSequence: 8,
                vertexType: "TRANSIT"
              },
              {
                name: "SW 18th & Morrison",
                stopId: "TriMet:6911",
                stopCode: "6911",
                lon: -122.690453,
                lat: 45.52188,
                arrival: 1574127849000,
                departure: 1574127849000,
                zoneId: "B",
                stopIndex: 8,
                stopSequence: 9,
                vertexType: "TRANSIT"
              },
              {
                name: "SW 18th & Salmon",
                stopId: "TriMet:9553",
                stopCode: "9553",
                lon: -122.691399,
                lat: 45.520377,
                arrival: 1574127900000,
                departure: 1574127900000,
                zoneId: "B",
                stopIndex: 9,
                stopSequence: 10,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Salmon & 20th",
                stopId: "TriMet:5018",
                stopCode: "5018",
                lon: -122.693948,
                lat: 45.520733,
                arrival: 1574127945000,
                departure: 1574127945000,
                zoneId: "B",
                stopIndex: 10,
                stopSequence: 11,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Park Pl & St Clair",
                stopId: "TriMet:4340",
                stopCode: "4340",
                lon: -122.69664,
                lat: 45.521348,
                arrival: 1574127991000,
                departure: 1574127991000,
                zoneId: "B",
                stopIndex: 11,
                stopSequence: 12,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Park Pl",
                stopId: "TriMet:6090",
                stopCode: "6090",
                lon: -122.698287,
                lat: 45.521064,
                arrival: 1574128020000,
                departure: 1574128020000,
                zoneId: "B",
                stopIndex: 12,
                stopSequence: 13,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Madison",
                stopId: "TriMet:6082",
                stopCode: "6082",
                lon: -122.698276,
                lat: 45.519926,
                arrival: 1574128044000,
                departure: 1574128044000,
                zoneId: "B",
                stopIndex: 13,
                stopSequence: 14,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Market Street",
                stopId: "TriMet:6085",
                stopCode: "6085",
                lon: -122.697457,
                lat: 45.518427,
                arrival: 1574128077000,
                departure: 1574128077000,
                zoneId: "B",
                stopIndex: 14,
                stopSequence: 15,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Montgomery",
                stopId: "TriMet:6086",
                stopCode: "6086",
                lon: -122.69662,
                lat: 45.515994,
                arrival: 1574128142000,
                departure: 1574128142000,
                zoneId: "B",
                stopIndex: 15,
                stopSequence: 16,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Jackson",
                stopId: "TriMet:6078",
                stopCode: "6078",
                lon: -122.697391,
                lat: 45.512572,
                arrival: 1574128228000,
                departure: 1574128228000,
                zoneId: "B",
                stopIndex: 16,
                stopSequence: 17,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Myrtle",
                stopId: "TriMet:6088",
                stopCode: "6088",
                lon: -122.698035,
                lat: 45.511379,
                arrival: 1574128255000,
                departure: 1574128255000,
                zoneId: "B",
                stopIndex: 17,
                stopSequence: 18,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Elm St",
                stopId: "TriMet:6074",
                stopCode: "6074",
                lon: -122.698764,
                lat: 45.510062,
                arrival: 1574128284000,
                departure: 1574128284000,
                zoneId: "B",
                stopIndex: 18,
                stopSequence: 19,
                vertexType: "TRANSIT"
              },
              {
                name: "2500 Block SW Vista",
                stopId: "TriMet:13573",
                stopCode: "13573",
                lon: -122.701323,
                lat: 45.508676,
                arrival: 1574128338000,
                departure: 1574128338000,
                zoneId: "B",
                stopIndex: 19,
                stopSequence: 20,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Isabella",
                stopId: "TriMet:6077",
                stopCode: "6077",
                lon: -122.704209,
                lat: 45.507233,
                arrival: 1574128404000,
                departure: 1574128404000,
                zoneId: "B",
                stopIndex: 20,
                stopSequence: 21,
                vertexType: "TRANSIT"
              }
            ],
            steps: []
          },
          {
            startTime: 1574128441000,
            endTime: 1574128874000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 538.8249999999999,
            pathway: false,
            mode: "WALK",
            route: "",
            agencyTimeZoneOffset: -28800000,
            interlineWithPreviousLeg: false,
            from: {
              name: "SW Vista & Broadway",
              stopId: "TriMet:6068",
              stopCode: "6068",
              lon: -122.703903,
              lat: 45.505533,
              arrival: 1574128440000,
              departure: 1574128441000,
              zoneId: "B",
              stopIndex: 21,
              stopSequence: 22,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Ravensview & Terrace",
              lon: -122.700325,
              lat: 45.507525,
              arrival: 1574128874000,
              orig: "SW Ravensview & Terrace",
              vertexType: "NORMAL"
            },
            legGeometry: {
              points:
                "qxvtGnr|kV@?@?JGCMGSCKAQAMAK?O?Q?UGa@GqAIeBCQEOEEEGIAGAG@GBCDGFW`@OTQP]VUHSBM?KCm@QGCEECEAEAE?K@_@?e@?oCAGCKCEOMQKECCCCGCECGCIAICKAMESEQJA@J@B",
              length: 63
            },
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: false,
            duration: 433,
            intermediateStops: [],
            steps: [
              {
                distance: 16.156,
                relativeDirection: "DEPART",
                streetName: "SW Patton Rd (path)",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.7039119063508,
                lat: 45.505535187298406,
                elevation: [
                  {
                    first: 10.009,
                    second: 219.12284254544676
                  },
                  {
                    first: 17.979,
                    second: 219.93284254544676
                  }
                ]
              },
              {
                distance: 52.78,
                relativeDirection: "CONTINUE",
                streetName: "SW Broadway Dr",
                absoluteDirection: "NORTHEAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.7038018,
                lat: 45.5054798,
                elevation: [
                  {
                    first: 0,
                    second: 219.3328425454468
                  },
                  {
                    first: 10,
                    second: 218.10284254544678
                  },
                  {
                    first: 20,
                    second: 217.5728425454468
                  },
                  {
                    first: 30,
                    second: 216.49284254544676
                  },
                  {
                    first: 40,
                    second: 215.85284254544678
                  },
                  {
                    first: 52.79,
                    second: 214.3828425454468
                  }
                ]
              },
              {
                distance: 100.607,
                relativeDirection: "SLIGHTLY_LEFT",
                streetName: "SW Ravensview Dr",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.7031449,
                lat: 45.5055625,
                elevation: [
                  {
                    first: 0,
                    second: 214.3828425454468
                  },
                  {
                    first: 10,
                    second: 213.91284254544678
                  },
                  {
                    first: 20,
                    second: 213.4028425454468
                  },
                  {
                    first: 30,
                    second: 213.79284254544677
                  },
                  {
                    first: 40,
                    second: 214.03284254544678
                  },
                  {
                    first: 50,
                    second: 214.3928425454468
                  },
                  {
                    first: 60,
                    second: 215.0828425454468
                  },
                  {
                    first: 70,
                    second: 215.10284254544678
                  },
                  {
                    first: 80,
                    second: 215.1328425454468
                  },
                  {
                    first: 90,
                    second: 215.9028425454468
                  },
                  {
                    first: 100.61,
                    second: 215.75284254544675
                  }
                ]
              },
              {
                distance: 356.068,
                relativeDirection: "SLIGHTLY_LEFT",
                streetName: "SW Ravensview Dr",
                absoluteDirection: "NORTHEAST",
                stayOn: true,
                area: false,
                bogusName: false,
                lon: -122.7018879,
                lat: 45.5057404,
                elevation: [
                  {
                    first: 0,
                    second: 215.75284254544675
                  },
                  {
                    first: 10,
                    second: 217.05284254544677
                  },
                  {
                    first: 20,
                    second: 217.91284254544678
                  },
                  {
                    first: 30,
                    second: 219.04284254544677
                  },
                  {
                    first: 40,
                    second: 219.72284254544678
                  },
                  {
                    first: 50,
                    second: 220.1528425454468
                  },
                  {
                    first: 60,
                    second: 220.72284254544678
                  },
                  {
                    first: 70,
                    second: 221.48284254544677
                  },
                  {
                    first: 80,
                    second: 221.7628425454468
                  },
                  {
                    first: 90,
                    second: 222.1528425454468
                  },
                  {
                    first: 100,
                    second: 222.56284254544676
                  },
                  {
                    first: 110,
                    second: 222.8928425454468
                  },
                  {
                    first: 120,
                    second: 222.2728425454468
                  },
                  {
                    first: 130,
                    second: 222.48284254544677
                  },
                  {
                    first: 140,
                    second: 222.10284254544678
                  },
                  {
                    first: 150,
                    second: 222.3928425454468
                  },
                  {
                    first: 160,
                    second: 222.5728425454468
                  },
                  {
                    first: 170,
                    second: 222.87284254544676
                  },
                  {
                    first: 180,
                    second: 222.6528425454468
                  },
                  {
                    first: 190,
                    second: 223.35284254544678
                  },
                  {
                    first: 199.47,
                    second: 223.68284254544676
                  },
                  {
                    first: 199.454,
                    second: 223.68284254544676
                  },
                  {
                    first: 209.454,
                    second: 223.73284254544677
                  },
                  {
                    first: 219.454,
                    second: 223.5728425454468
                  },
                  {
                    first: 229.454,
                    second: 223.3228425454468
                  },
                  {
                    first: 239.454,
                    second: 223.3228425454468
                  },
                  {
                    first: 249.454,
                    second: 223.18284254544676
                  },
                  {
                    first: 259.454,
                    second: 222.56284254544676
                  },
                  {
                    first: 269.454,
                    second: 222.05284254544677
                  },
                  {
                    first: 279.454,
                    second: 221.0228425454468
                  },
                  {
                    first: 289.454,
                    second: 221.03284254544678
                  },
                  {
                    first: 299.454,
                    second: 220.41284254544678
                  },
                  {
                    first: 309.454,
                    second: 220.28284254544678
                  },
                  {
                    first: 319.454,
                    second: 219.80284254544677
                  },
                  {
                    first: 329.454,
                    second: 219.4028425454468
                  },
                  {
                    first: 339.454,
                    second: 218.5728425454468
                  },
                  {
                    first: 349.454,
                    second: 218.60284254544678
                  },
                  {
                    first: 356.094,
                    second: 219.03284254544678
                  }
                ]
              },
              {
                distance: 13.214,
                relativeDirection: "UTURN_RIGHT",
                streetName: "SW Ravensview Dr (path)",
                absoluteDirection: "WEST",
                stayOn: true,
                area: false,
                bogusName: false,
                lon: -122.7002374,
                lat: 45.5075393,
                elevation: [
                  {
                    first: 0,
                    second: 218.3928425454468
                  },
                  {
                    first: 4.69,
                    second: 217.8928425454468
                  }
                ]
              }
            ]
          }
        ],
        tooSloped: false
      },
      {
        duration: 6045,
        startTime: 1574123751000,
        endTime: 1574129796000,
        walkTime: 1381,
        transitTime: 2615,
        waitingTime: 2049,
        walkDistance: 1725.2088805889475,
        walkLimitExceeded: false,
        elevationLost: 3.9700000000000024,
        elevationGained: 9.34,
        transfers: 2,
        fare: {
          fare: {
            regular: {
              currency: {
                symbol: "$",
                currency: "USD",
                defaultFractionDigits: 2,
                currencyCode: "USD"
              },
              cents: 250
            }
          },
          details: {}
        },
        legs: [
          {
            startTime: 1574123751000,
            endTime: 1574124604000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 1024.837,
            pathway: false,
            mode: "WALK",
            route: "",
            agencyTimeZoneOffset: -28800000,
            interlineWithPreviousLeg: false,
            from: {
              name: "3520 NE Broadway, Portland, OR, USA 97232",
              lon: -122.62763465127287,
              lat: 45.534701774459776,
              departure: 1574123751000,
              orig: "3520 NE Broadway, Portland, OR, USA 97232",
              vertexType: "NORMAL"
            },
            to: {
              name: "Hollywood/NE 42nd Ave TC MAX Station",
              stopId: "TriMet:8373",
              stopCode: "8373",
              lon: -122.621367,
              lat: 45.532957,
              arrival: 1574124604000,
              departure: 1574124605000,
              zoneId: "R",
              stopIndex: 3,
              stopSequence: 4,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "}n|tGtumkVy@@D??Ac@AA}H?q@?k@?uA?U?Q?[?E?M?_@?iBAmB?O?u@ASL?BATMVCRA\\?p@?J?P??_A?y@J?f@?XDBo@?Y@I?]?wA?u@?O?cB?[?MP?B@@@X?B?X?Z?JFLA@?@AJ?@B~@@CNB@Kt@A?ADQnAKv@",
              length: 65
            },
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: false,
            duration: 853,
            intermediateStops: [],
            steps: [
              {
                distance: 49.491,
                relativeDirection: "DEPART",
                streetName: "service road",
                absoluteDirection: "NORTH",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.62762443819214,
                lat: 45.53471487200395,
                elevation: [
                  {
                    first: 0,
                    second: 41.89284254544678
                  },
                  {
                    first: 10,
                    second: 42.03284254544678
                  },
                  {
                    first: 20,
                    second: 42.212842545446776
                  },
                  {
                    first: 28.79,
                    second: 42.20284254544678
                  },
                  {
                    first: 28.791,
                    second: 41.89284254544678
                  },
                  {
                    first: 38.791,
                    second: 41.98284254544678
                  },
                  {
                    first: 49.491,
                    second: 41.932842545446775
                  }
                ]
              },
              {
                distance: 360.30400000000003,
                relativeDirection: "RIGHT",
                streetName: "NE Broadway",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6276191,
                lat: 45.5351574,
                elevation: [
                  {
                    first: 0,
                    second: 41.932842545446775
                  },
                  {
                    first: 10,
                    second: 42.03284254544678
                  },
                  {
                    first: 20,
                    second: 42.13284254544678
                  },
                  {
                    first: 30,
                    second: 42.24284254544678
                  },
                  {
                    first: 40,
                    second: 42.27284254544678
                  },
                  {
                    first: 50,
                    second: 42.22284254544678
                  },
                  {
                    first: 60,
                    second: 42.24284254544678
                  },
                  {
                    first: 70,
                    second: 42.28284254544678
                  },
                  {
                    first: 80,
                    second: 42.36284254544678
                  },
                  {
                    first: 90,
                    second: 42.42284254544678
                  },
                  {
                    first: 100,
                    second: 42.45284254544678
                  },
                  {
                    first: 110,
                    second: 42.51284254544677
                  },
                  {
                    first: 124.07,
                    second: 42.58284254544678
                  },
                  {
                    first: 124.066,
                    second: 42.58284254544678
                  },
                  {
                    first: 134.066,
                    second: 42.77284254544678
                  },
                  {
                    first: 143.406,
                    second: 43.00284254544678
                  },
                  {
                    first: 143.405,
                    second: 43.00284254544678
                  },
                  {
                    first: 153.405,
                    second: 43.26284254544677
                  },
                  {
                    first: 161.035,
                    second: 43.44284254544678
                  },
                  {
                    first: 161.031,
                    second: 43.44284254544678
                  },
                  {
                    first: 171.031,
                    second: 43.69284254544678
                  },
                  {
                    first: 181.031,
                    second: 43.962842545446776
                  },
                  {
                    first: 191.031,
                    second: 44.072842545446775
                  },
                  {
                    first: 202.591,
                    second: 44.20284254544678
                  },
                  {
                    first: 223.11200000000002,
                    second: 44.48284254544678
                  },
                  {
                    first: 228.79200000000003,
                    second: 44.63284254544678
                  },
                  {
                    first: 228.79000000000002,
                    second: 44.63284254544678
                  },
                  {
                    first: 241.18,
                    second: 44.80284254544678
                  },
                  {
                    first: 241.175,
                    second: 44.80284254544678
                  },
                  {
                    first: 251.175,
                    second: 44.92284254544678
                  },
                  {
                    first: 261.175,
                    second: 45.05284254544678
                  },
                  {
                    first: 271.175,
                    second: 45.17284254544678
                  },
                  {
                    first: 282.265,
                    second: 45.28284254544678
                  },
                  {
                    first: 282.265,
                    second: 45.28284254544678
                  },
                  {
                    first: 292.265,
                    second: 45.34284254544678
                  },
                  {
                    first: 302.265,
                    second: 45.39284254544678
                  },
                  {
                    first: 312.265,
                    second: 45.49284254544678
                  },
                  {
                    first: 325.015,
                    second: 45.63284254544678
                  },
                  {
                    first: 325.019,
                    second: 45.63284254544678
                  },
                  {
                    first: 331.23900000000003,
                    second: 45.66284254544678
                  },
                  {
                    first: 331.242,
                    second: 45.66284254544678
                  },
                  {
                    first: 341.242,
                    second: 45.44284254544678
                  },
                  {
                    first: 351.242,
                    second: 45.49284254544678
                  },
                  {
                    first: 360.312,
                    second: 45.64284254544678
                  }
                ]
              },
              {
                distance: 108.60600000000001,
                relativeDirection: "RIGHT",
                streetName: "NE Cesar E. Chavez Blvd",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6229946,
                lat: 45.5351838,
                elevation: [
                  {
                    first: 0,
                    second: 45.64284254544678
                  },
                  {
                    first: 10,
                    second: 45.67284254544678
                  },
                  {
                    first: 20,
                    second: 45.51284254544677
                  },
                  {
                    first: 30,
                    second: 45.56284254544678
                  },
                  {
                    first: 36.64,
                    second: 45.52284254544678
                  },
                  {
                    first: 36.624,
                    second: 45.52284254544678
                  },
                  {
                    first: 46.624,
                    second: 45.432842545446775
                  },
                  {
                    first: 56.624,
                    second: 45.36284254544678
                  },
                  {
                    first: 64.154,
                    second: 45.33284254544678
                  },
                  {
                    first: 64.152,
                    second: 45.33284254544678
                  },
                  {
                    first: 74.152,
                    second: 45.34284254544678
                  },
                  {
                    first: 84.152,
                    second: 45.402842545446774
                  },
                  {
                    first: 92.202,
                    second: 45.402842545446774
                  },
                  {
                    first: 92.206,
                    second: 45.402842545446774
                  },
                  {
                    first: 98.626,
                    second: 45.462842545446776
                  },
                  {
                    first: 98.62100000000001,
                    second: 45.462842545446776
                  },
                  {
                    first: 108.611,
                    second: 45.70284254544678
                  }
                ]
              },
              {
                distance: 47.605999999999995,
                relativeDirection: "LEFT",
                streetName: "path",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.6228845,
                lat: 45.5342193,
                elevation: [
                  {
                    first: 0,
                    second: 45.70284254544678
                  },
                  {
                    first: 10,
                    second: 45.962842545446776
                  },
                  {
                    first: 20,
                    second: 46.13284254544678
                  },
                  {
                    first: 25.1,
                    second: 46.09284254544678
                  },
                  {
                    first: 25.104,
                    second: 46.09284254544678
                  },
                  {
                    first: 35.104,
                    second: 46.00284254544678
                  },
                  {
                    first: 47.604,
                    second: 45.67284254544678
                  }
                ]
              },
              {
                distance: 44.528,
                relativeDirection: "RIGHT",
                streetName: "NE 40th Ave",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6222733,
                lat: 45.5342192,
                elevation: [
                  {
                    first: 0,
                    second: 45.67284254544678
                  },
                  {
                    first: 6.64,
                    second: 45.652842545446774
                  },
                  {
                    first: 6.638,
                    second: 45.652842545446774
                  },
                  {
                    first: 16.637999999999998,
                    second: 45.60284254544678
                  },
                  {
                    first: 26.637999999999998,
                    second: 45.56284254544678
                  },
                  {
                    first: 36.638,
                    second: 45.712842545446776
                  },
                  {
                    first: 44.538,
                    second: 45.31284254544678
                  }
                ]
              },
              {
                distance: 161.75500000000002,
                relativeDirection: "LEFT",
                streetName: "NE Halsey St",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6223055,
                lat: 45.5338206,
                elevation: [
                  {
                    first: 0,
                    second: 45.31284254544678
                  },
                  {
                    first: 10,
                    second: 45.55284254544678
                  },
                  {
                    first: 20,
                    second: 45.91284254544678
                  },
                  {
                    first: 28.98,
                    second: 46.10284254544678
                  },
                  {
                    first: 28.978,
                    second: 46.10284254544678
                  },
                  {
                    first: 38.978,
                    second: 46.27284254544678
                  },
                  {
                    first: 44.758,
                    second: 46.402842545446774
                  },
                  {
                    first: 44.755,
                    second: 46.402842545446774
                  },
                  {
                    first: 54.755,
                    second: 46.572842545446775
                  },
                  {
                    first: 64.755,
                    second: 46.75284254544678
                  },
                  {
                    first: 79.055,
                    second: 46.902842545446774
                  },
                  {
                    first: 79.05000000000001,
                    second: 46.902842545446774
                  },
                  {
                    first: 89.05000000000001,
                    second: 46.962842545446776
                  },
                  {
                    first: 99.57000000000001,
                    second: 46.902842545446774
                  },
                  {
                    first: 99.57400000000001,
                    second: 46.902842545446774
                  },
                  {
                    first: 106.24400000000001,
                    second: 46.92284254544678
                  },
                  {
                    first: 106.24200000000002,
                    second: 46.92284254544678
                  },
                  {
                    first: 116.24200000000002,
                    second: 46.99284254544678
                  },
                  {
                    first: 126.24200000000002,
                    second: 47.03284254544678
                  },
                  {
                    first: 136.24200000000002,
                    second: 47.072842545446775
                  },
                  {
                    first: 146.24200000000002,
                    second: 47.10284254544678
                  },
                  {
                    first: 155.71200000000002,
                    second: 47.22284254544678
                  },
                  {
                    first: 155.711,
                    second: 47.22284254544678
                  },
                  {
                    first: 161.751,
                    second: 47.34284254544678
                  }
                ]
              },
              {
                distance: 10.663,
                relativeDirection: "RIGHT",
                streetName: "path",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.6202302,
                lat: 45.5337979,
                elevation: [
                  {
                    first: 0,
                    second: 47.34284254544678
                  },
                  {
                    first: 10.66,
                    second: 47.55284254544678
                  }
                ]
              },
              {
                distance: 57.919000000000004,
                relativeDirection: "CONTINUE",
                streetName: "Hollywood TC (path)",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6202305,
                lat: 45.533702,
                elevation: [
                  {
                    first: 0,
                    second: 47.55284254544678
                  },
                  {
                    first: 10,
                    second: 47.58284254544678
                  },
                  {
                    first: 18.02,
                    second: 47.61284254544678
                  },
                  {
                    first: 34.465,
                    second: 47.572842545446775
                  },
                  {
                    first: 44.465,
                    second: 47.63284254544678
                  },
                  {
                    first: 57.925000000000004,
                    second: 47.44284254544678
                  }
                ]
              },
              {
                distance: 32.794,
                relativeDirection: "CONTINUE",
                streetName: "steps",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.6202905,
                lat: 45.5331901,
                elevation: [
                  {
                    first: 0,
                    second: 47.44284254544678
                  },
                  {
                    first: 15.98,
                    second: 46.99284254544678
                  },
                  {
                    first: 15.984,
                    second: 46.99284254544678
                  },
                  {
                    first: 32.794,
                    second: 46.14284254544678
                  }
                ]
              },
              {
                distance: 46.18600000000001,
                relativeDirection: "RIGHT",
                streetName: "Hollywood TC (path)",
                absoluteDirection: "SOUTHWEST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6202796,
                lat: 45.5330437,
                elevation: [
                  {
                    first: 0,
                    second: 46.14284254544678
                  },
                  {
                    first: 1.4,
                    second: 45.87284254544678
                  },
                  {
                    first: 1.396,
                    second: 45.87284254544678
                  },
                  {
                    first: 36.976,
                    second: 47.28284254544678
                  },
                  {
                    first: 36.971000000000004,
                    second: 47.28284254544678
                  },
                  {
                    first: 46.191,
                    second: 47.652842545446774
                  }
                ]
              },
              {
                distance: 47.323,
                relativeDirection: "SLIGHTLY_RIGHT",
                streetName: "steps",
                absoluteDirection: "WEST",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.6203917,
                lat: 45.5327133,
                elevation: [
                  {
                    first: 0,
                    second: 47.652842545446774
                  },
                  {
                    first: 10,
                    second: 47.35284254544678
                  },
                  {
                    first: 23.63,
                    second: 47.19284254544678
                  }
                ]
              },
              {
                distance: 57.662000000000006,
                relativeDirection: "CONTINUE",
                streetName: "Hollywood TC /NE 42nd Ave (path)",
                absoluteDirection: "WEST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6206678,
                lat: 45.5327864,
                elevation: []
              }
            ]
          },
          {
            startTime: 1574124605000,
            endTime: 1574125540000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 5070.440587369664,
            pathway: false,
            mode: "TRAM",
            route: "MAX Blue Line",
            agencyName: "TriMet",
            agencyUrl: "http://trimet.org/",
            agencyTimeZoneOffset: -28800000,
            routeColor: "084C8D",
            routeType: 0,
            routeId: "TriMet:100",
            routeTextColor: "FFFFFF",
            interlineWithPreviousLeg: false,
            tripBlockId: "9044",
            headsign: "Hillsboro",
            agencyId: "TRIMET",
            tripId: "TriMet:9501026",
            serviceDate: "20191118",
            from: {
              name: "Hollywood/NE 42nd Ave TC MAX Station",
              stopId: "TriMet:8373",
              stopCode: "8373",
              lon: -122.621367,
              lat: 45.532957,
              arrival: 1574124604000,
              departure: 1574124605000,
              zoneId: "R",
              stopIndex: 3,
              stopSequence: 4,
              vertexType: "TRANSIT"
            },
            to: {
              name: "Morrison/SW 3rd Ave MAX Station",
              stopId: "TriMet:8381",
              stopCode: "8381",
              lon: -122.675386,
              lat: 45.518181,
              arrival: 1574125540000,
              departure: 1574125540000,
              zoneId: "R",
              stopIndex: 11,
              stopSequence: 12,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "cd|tGnnlkVIh@Kt@SrAGf@Gb@EVOlA_@tCu@pFo@dEq@|Eo@~ECPAPCXAXALAPAN?P?VAP@`@?R?N@NB^@L@N@L@PBTBLBL@LH`@FXHZDLDPFPBHNZFNFLHPJPNTNTNPTVRRTRbAz@n@f@fBvAXTXTXVVVPPNRNPNRRXP\\HPHPHPTj@HZHTFXDRH^DZDVDZD\\B`@B`@B^@f@@h@DbCN~GRbL\\jTF|CF|CF|CLvH@f@?f@@^?f@A\\?R?^ElB?ZC|@?h@An@Ax@?dB?bAAl@?Z?d@?p@?xA?tC??@T?X?D?R@V?R?f@?r@?xB?xA?^?d@?~@CdB?`C?V?N@\\?D?X?nD?zD?JAX@vC?X?ZAlC??@Z?JAnD?R?`@ATAVAl@?FAL?FCNAJARAbD?T?L?H?H@H@D@HDJBHR\\PZPVHJBDFFDFFDFDDDDBLHl@PZHVHXJJDJFHDJHHFHJNNDFFHHLHLHPFRVr@dAvC~@nCb@nAb@lAN`@JVLVLTFHDFBDDDFFJJLLHFFDHDRJJBFBFBD@JBH@N@J@J@hACN?H?F?hBCT?lCEJ?NAz@GXApA@B?LA\\?RCB?JC`@ID?D?F?B?F?F@HBJBZPVJbCfAbBt@^TnB|@FDLDNDNFt@TZLpBz@p@ZrAj@HFFFDJBJ@J?HAD?HCHAN[`BCNGd@a@zB",
              length: 282
            },
            interStopGeometry: [
              {
                points:
                  "cd|tGnnlkVIh@Kt@SrAGf@Gb@EVOlA_@tCu@pFo@dEq@|Eo@~ECPAPCXAXALAPAN?P?VAP@`@?R?N@NB^@L@N@L@PBTBLBL@LH`@FXHZDLDPFPBHNZFNFLHPJPNTNTNPTVRRTRbAz@n@f@fBvAXTXTXVVVPPNRNPNRRXP\\HPHPHPTj@HZHTFXDRH^DZDVDZD\\B`@B`@B^@f@@h@DbCN~GRbL\\jTF|CF|CF|CLvH@f@?f@@^?f@A\\?R?^ElB?ZC|@?h@An@Ax@?dB?bAAl@?Z?d@?p@?xA?tC",
                length: 114
              },
              {
                points: "er{tGr|rkV??@T?X?D?R@V?R?f@?r@?xB?xA?^?d@?~@CdB?`C",
                length: 17
              },
              {
                points: "er{tGfuskV?V?N@\\?D?X?nD?zD?JAX@vC?X?ZAlC??",
                length: 15
              },
              {
                points: "er{tGzotkV@Z?JAnD?R?`@ATAVAl@?FAL?FCNAJARAbD",
                length: 16
              },
              {
                points:
                  "wr{tGvbukV?T?L?H?H@H@D@HDJBHR\\PZPVHJBDFFDFFDFDDDDBLHl@PZHVHXJJDJFHDJHHFHJNNDFFHHLHLHPFRVr@dAvC~@nCb@nAb@lAN`@JVLVLTFHDFBDDDFFJJLLHFFDHDRJJBFBFBD@JBH@N@J@J@hACN?H?F?hBC",
                length: 73
              },
              {
                points: "ipztGngvkVT?lCEJ?NAz@GXApA@B?",
                length: 9
              },
              {
                points:
                  "}dztG~fvkVLA\\?RCB?JC`@ID?D?F?B?F?F@HBJBZPVJbCfAbBt@^TnB|@",
                length: 21
              },
              {
                points:
                  "arytGdnvkVFDLDNDNFt@TZLpBz@p@ZrAj@HFFFDJBJ@J?HAD?HCHAN[`BCNGd@a@zB",
                length: 24
              }
            ],
            alerts: [
              {
                alertDescriptionText:
                  "The Park and Ride garage elevator at Sunset Transit Center is closed for approximately 3 months for improvements. During this time garage users must use the stairs or find alternate parking. Visit trimet.org/parkandride for a complete list of Park and Ride garages.",
                alertUrl:
                  "https://news.trimet.org/2019/11/next-up-for-elevator-improvements-sunset-transit-center-park-ride/",
                effectiveStartDate: 1573083439000
              },
              {
                alertDescriptionText:
                  "The eastbound platform elevator at Sunset Transit Center is currently closed and will reopen the morning of Wednesday, December 4. During the closure use the westbound platform elevator and cross at the modified crossing between platforms.",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1574087400000
              },
              {
                alertDescriptionText:
                  "Beginning Wednesday, December 4, through Friday, December 6, the westbound platform elevator at Sunset Transit Center will be closed for maintenance. During the closure use the eastbound platform elevator and cross at the modified crossing between platforms.",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1574087400000
              },
              {
                alertDescriptionText:
                  "The west elevators at the Washington Park MAX Station are out of service. Please use east elevators to access street level and platforms. ",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1572827580000
              }
            ],
            routeLongName: "MAX Blue Line",
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: true,
            duration: 935,
            intermediateStops: [
              {
                name: "Lloyd Center/NE 11th Ave MAX Station",
                stopId: "TriMet:8374",
                stopCode: "8374",
                lon: -122.654335,
                lat: 45.530146,
                arrival: 1574124785000,
                departure: 1574124820000,
                zoneId: "R",
                stopIndex: 4,
                stopSequence: 5,
                vertexType: "TRANSIT"
              },
              {
                name: "NE 7th Ave MAX Station",
                stopId: "TriMet:8375",
                stopCode: "8375",
                lon: -122.658277,
                lat: 45.53015,
                arrival: 1574124875000,
                departure: 1574124905000,
                zoneId: "R",
                stopIndex: 5,
                stopSequence: 6,
                vertexType: "TRANSIT"
              },
              {
                name: "Convention Center MAX Station",
                stopId: "TriMet:8376",
                stopCode: "8376",
                lon: -122.66254,
                lat: 45.530138,
                arrival: 1574124965000,
                departure: 1574124990000,
                zoneId: "R",
                stopIndex: 6,
                stopSequence: 7,
                vertexType: "TRANSIT"
              },
              {
                name: "Rose Quarter TC MAX Station",
                stopId: "TriMet:8377",
                stopCode: "8377",
                lon: -122.665557,
                lat: 45.530235,
                arrival: 1574125050000,
                departure: 1574125080000,
                zoneId: "R",
                stopIndex: 7,
                stopSequence: 8,
                vertexType: "TRANSIT"
              },
              {
                name: "Old Town/Chinatown MAX Station",
                stopId: "TriMet:8378",
                stopCode: "8378",
                lon: -122.671467,
                lat: 45.524695,
                arrival: 1574125255000,
                departure: 1574125285000,
                zoneId: "R",
                stopIndex: 8,
                stopSequence: 9,
                vertexType: "TRANSIT"
              },
              {
                name: "Skidmore Fountain MAX Station",
                stopId: "TriMet:8379",
                stopCode: "8379",
                lon: -122.67139,
                lat: 45.522873,
                arrival: 1574125330000,
                departure: 1574125355000,
                zoneId: "R",
                stopIndex: 9,
                stopSequence: 10,
                vertexType: "TRANSIT"
              },
              {
                name: "Oak/ SW 1st Ave MAX Station",
                stopId: "TriMet:8380",
                stopCode: "8380",
                lon: -122.672523,
                lat: 45.51986,
                arrival: 1574125420000,
                departure: 1574125455000,
                zoneId: "R",
                stopIndex: 10,
                stopSequence: 11,
                vertexType: "TRANSIT"
              }
            ],
            steps: []
          },
          {
            startTime: 1574125540000,
            endTime: 1574126019000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 638.0079999999999,
            pathway: false,
            mode: "WALK",
            route: "",
            agencyTimeZoneOffset: -28800000,
            interlineWithPreviousLeg: false,
            from: {
              name: "Morrison/SW 3rd Ave MAX Station",
              stopId: "TriMet:8381",
              stopCode: "8381",
              lon: -122.675386,
              lat: 45.518181,
              arrival: 1574125540000,
              departure: 1574125540000,
              zoneId: "R",
              stopIndex: 11,
              stopSequence: 12,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Columbia & 2nd",
              stopId: "TriMet:14053",
              stopCode: "14053",
              lon: -122.677233,
              lat: 45.513309,
              arrival: 1574126019000,
              departure: 1574126315000,
              zoneId: "B",
              stopIndex: 4,
              stopSequence: 5,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "ogytGf`wkVCLERpB|@FBDBFBlBz@JDJFjBx@LDJFjBz@JHJDjBz@JDNF`Ab@d@RLFJDlBz@HDDSh@}C",
              length: 27
            },
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: false,
            duration: 479,
            intermediateStops: [],
            steps: [
              {
                distance: 6.344,
                relativeDirection: "DEPART",
                streetName: "Morrison/SW 3rd Ave (path)",
                absoluteDirection: "WEST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6753932397155,
                lat: 45.51816759931498,
                elevation: []
              },
              {
                distance: 8.129,
                relativeDirection: "CONTINUE",
                streetName: "path",
                absoluteDirection: "WEST",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.6754694,
                lat: 45.5181878,
                elevation: [
                  {
                    first: 0,
                    second: 9.982842545446779
                  },
                  {
                    first: 8.13,
                    second: 9.862842545446778
                  }
                ]
              },
              {
                distance: 549.1899999999999,
                relativeDirection: "LEFT",
                streetName: "SW 3rd Ave",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6755675,
                lat: 45.5182127,
                elevation: [
                  {
                    first: 0,
                    second: 9.862842545446778
                  },
                  {
                    first: 10,
                    second: 10.122842545446778
                  },
                  {
                    first: 20,
                    second: 10.402842545446779
                  },
                  {
                    first: 30,
                    second: 10.622842545446778
                  },
                  {
                    first: 40,
                    second: 10.822842545446779
                  },
                  {
                    first: 50,
                    second: 10.922842545446779
                  },
                  {
                    first: 60,
                    second: 11.012842545446778
                  },
                  {
                    first: 67.74,
                    second: 11.032842545446778
                  },
                  {
                    first: 67.735,
                    second: 11.032842545446778
                  },
                  {
                    first: 76.445,
                    second: 11.082842545446779
                  },
                  {
                    first: 76.444,
                    second: 11.082842545446779
                  },
                  {
                    first: 80.84400000000001,
                    second: 11.122842545446778
                  },
                  {
                    first: 80.846,
                    second: 11.122842545446778
                  },
                  {
                    first: 90.846,
                    second: 11.332842545446779
                  },
                  {
                    first: 100.846,
                    second: 11.472842545446778
                  },
                  {
                    first: 110.846,
                    second: 11.55284254544678
                  },
                  {
                    first: 120.846,
                    second: 11.672842545446779
                  },
                  {
                    first: 130.846,
                    second: 11.762842545446778
                  },
                  {
                    first: 140.846,
                    second: 11.89284254544678
                  },
                  {
                    first: 153.20600000000002,
                    second: 11.972842545446778
                  },
                  {
                    first: 153.208,
                    second: 11.972842545446778
                  },
                  {
                    first: 163.208,
                    second: 12.002842545446779
                  },
                  {
                    first: 173.208,
                    second: 12.162842545446779
                  },
                  {
                    first: 183.208,
                    second: 12.332842545446777
                  },
                  {
                    first: 193.208,
                    second: 12.512842545446778
                  },
                  {
                    first: 203.208,
                    second: 12.632842545446778
                  },
                  {
                    first: 213.208,
                    second: 12.762842545446778
                  },
                  {
                    first: 223.208,
                    second: 12.862842545446778
                  },
                  {
                    first: 232.618,
                    second: 12.932842545446778
                  },
                  {
                    first: 232.62,
                    second: 12.932842545446778
                  },
                  {
                    first: 239.94,
                    second: 12.992842545446777
                  },
                  {
                    first: 239.936,
                    second: 12.992842545446777
                  },
                  {
                    first: 249.936,
                    second: 13.14284254544678
                  },
                  {
                    first: 259.93600000000004,
                    second: 13.332842545446777
                  },
                  {
                    first: 269.93600000000004,
                    second: 13.532842545446778
                  },
                  {
                    first: 279.93600000000004,
                    second: 13.732842545446779
                  },
                  {
                    first: 289.93600000000004,
                    second: 13.882842545446778
                  },
                  {
                    first: 304.076,
                    second: 14.032842545446778
                  },
                  {
                    first: 304.072,
                    second: 14.032842545446778
                  },
                  {
                    first: 312.142,
                    second: 14.132842545446778
                  },
                  {
                    first: 312.14300000000003,
                    second: 14.132842545446778
                  },
                  {
                    first: 319.00300000000004,
                    second: 14.202842545446778
                  },
                  {
                    first: 319.00600000000003,
                    second: 14.202842545446778
                  },
                  {
                    first: 329.00600000000003,
                    second: 14.472842545446778
                  },
                  {
                    first: 339.00600000000003,
                    second: 14.782842545446778
                  },
                  {
                    first: 349.00600000000003,
                    second: 15.05284254544678
                  },
                  {
                    first: 359.00600000000003,
                    second: 15.30284254544678
                  },
                  {
                    first: 369.00600000000003,
                    second: 15.572842545446779
                  },
                  {
                    first: 383.73600000000005,
                    second: 15.882842545446778
                  },
                  {
                    first: 383.731,
                    second: 15.882842545446778
                  },
                  {
                    first: 391.041,
                    second: 15.902842545446777
                  },
                  {
                    first: 391.045,
                    second: 15.902842545446777
                  },
                  {
                    first: 400.52500000000003,
                    second: 16.09284254544678
                  },
                  {
                    first: 400.522,
                    second: 16.09284254544678
                  },
                  {
                    first: 410.522,
                    second: 16.422842545446777
                  },
                  {
                    first: 420.522,
                    second: 16.652842545446777
                  },
                  {
                    first: 430.522,
                    second: 16.922842545446777
                  },
                  {
                    first: 440.522,
                    second: 17.282842545446776
                  },
                  {
                    first: 450.522,
                    second: 17.73284254544678
                  },
                  {
                    first: 461.952,
                    second: 18.25284254544678
                  },
                  {
                    first: 461.952,
                    second: 18.25284254544678
                  },
                  {
                    first: 471.012,
                    second: 18.292842545446778
                  },
                  {
                    first: 471.015,
                    second: 18.292842545446778
                  },
                  {
                    first: 481.015,
                    second: 18.43284254544678
                  },
                  {
                    first: 491.015,
                    second: 18.672842545446777
                  },
                  {
                    first: 501.015,
                    second: 18.89284254544678
                  },
                  {
                    first: 511.015,
                    second: 19.18284254544678
                  },
                  {
                    first: 521.015,
                    second: 19.452842545446778
                  },
                  {
                    first: 531.015,
                    second: 19.702842545446778
                  },
                  {
                    first: 541.015,
                    second: 19.902842545446777
                  },
                  {
                    first: 549.1949999999999,
                    second: 19.952842545446778
                  }
                ]
              },
              {
                distance: 74.345,
                relativeDirection: "LEFT",
                streetName: "SW Columbia St",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6780945,
                lat: 45.513603,
                elevation: []
              }
            ]
          },
          {
            startTime: 1574126315000,
            endTime: 1574127540000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 6442.866651671345,
            pathway: false,
            mode: "BUS",
            route: "55",
            agencyName: "TriMet",
            agencyUrl: "http://trimet.org/",
            agencyTimeZoneOffset: -28800000,
            routeType: 3,
            routeId: "TriMet:55",
            interlineWithPreviousLeg: false,
            tripBlockId: "5568",
            headsign: "Raleigh Hills",
            agencyId: "TRIMET",
            tripId: "TriMet:9494097",
            serviceDate: "20191118",
            from: {
              name: "SW Columbia & 2nd",
              stopId: "TriMet:14053",
              stopCode: "14053",
              lon: -122.677233,
              lat: 45.513309,
              arrival: 1574126019000,
              departure: 1574126315000,
              zoneId: "B",
              stopIndex: 4,
              stopSequence: 5,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Dosch & Hamilton",
              stopId: "TriMet:1519",
              stopCode: "1519",
              lon: -122.710281,
              lat: 45.490477,
              arrival: 1574127540000,
              departure: 1574127540000,
              zoneId: "B",
              stopIndex: 22,
              stopSequence: 23,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "oixtGpkwkV@EBSp@yDp@XrAl@vAl@^PLF`@eCDODMHg@L\\p@XR?z@b@RJ|CrATHJFVH@@ND@@JRnAj@HBVJRFRFRDRBTDR@X@JID?F?D?h@@p@@x@@dEBLJD@N?p@@h@BhABrBFz@BvBFt@@|D@J?b@?bB@`C@vAAjBAh@?xB?P?~@@fHP`FJt@@Z@PARARCJCREPGb@SRMr@e@TMPIRGl@MrCa@fAMZC`@?Z@L@PAZH^LRHRJRLRLVPRRRRV^`@h@LVHLHNHPHRBFRJPj@HZDRDTDXDX`@|CFh@F`@DRDRF\\Lf@L`@L\\LZN\\BDJPLTPRPTRRJJHHNJLJJDLHJDJDFBJBJBJBJ@J@J?N@XAzACXC\\ARFn@I`@GLOzGcBTEXKLGNGNIVQd@]h@e@x@q@l@a@VORKTIRIZGd@GlE_@hD[tAMhAK`@PHBDDBDDFBFDPP|ABVJvAHRVrDB`@@`@@\\?^?RAXC^C\\E^Kr@_@`CCRCTEf@Ej@A^AZ?T@V?V@VBX@N?DD`@D^Db@BT@P?N@BAPAZA\\Ez@GtAAR?N?L?N@^?N@PBP@PBPBLBLF`@H\\Nl@f@dBRz@Nf@bAxD^tAPt@X|@H\\FTJb@SR[ZKJKJSPIF[ZOLUR??]Z[VGFaAz@yClCm@h@o@l@c@`@UXMPMPQXORS^gAxBU`@i@bAS^[ZSJGBIBYDM?MAGASGSM_@[YUKIMIOGQEW?S@A?QFQHQNWZcClDINQ\\ELCFCH[|@EP[p@Wd@]d@w@bAy@dAgBzBaBrBq@z@U^ADIPKRGPSt@Id@EP?BGf@AVCl@@b@Bz@HxA?J@hA@nA?~@?TC`E?`DA^?N?lCAnE?XI?qA@q@AoB?}A@",
              length: 347
            },
            interStopGeometry: [
              {
                points:
                  "oixtGpkwkV@EBSp@yDp@XrAl@vAl@^PLF`@eCDODMHg@L\\p@XR?z@b@RJ|CrATHJF",
                length: 21
              },
              {
                points:
                  "orwtGniwkVVH@@ND@@JRnAj@HBVJRFRFRDRBTDR@X@JID?F?D?h@@p@@x@@dEBLJD@",
                length: 26
              },
              {
                points:
                  "a|vtGdnwkVN?p@@h@BhABrBFz@BvBFt@@|D@J?b@?bB@`C@vAAjBAh@?xB?P?~@@fHP`FJt@@Z@PARARCJCREPGb@SRMr@e@TMPIRGl@MrCa@fAMZC`@?Z@L@PAZH^LRHRJRLRLVPRRRRV^`@h@LVHLHNHPHR",
                length: 60
              },
              {
                points:
                  "o}stGrswkVBFRJPj@HZDRDTDXDX`@|CFh@F`@DRDRF\\Lf@L`@L\\LZN\\BDJPLTPRPTRRJJHHNJLJJDLHJDJDFBJBJBJBJ@J@J?N@XAzACXC\\ARFn@I`@G",
                length: 49
              },
              {
                points:
                  "eestGtmxkVLOzGcBTEXKLGNGNIVQd@]h@e@x@q@l@a@VORKTIRIZGd@GlE_@hD[tAMhAK`@PHBDDBDDFBFDPP|ABVJvAHRVrDB`@@`@@\\?^?RAXC^C\\E^Kr@_@`CCRCTEf@Ej@A^AZ?T@V?V@VBX@N?DD`@D^Db@BT@P?N",
                length: 65
              },
              {
                points:
                  "}yqtGxjykV@BAPAZA\\Ez@GtAAR?N?L?N@^?N@PBP@PBPBLBLF`@H\\Nl@f@dBRz@Nf@bAxD^tAPt@X|@H\\",
                length: 30
              },
              {
                points: "sqqtGjozkVFTJb@SR[ZKJKJSPIF[ZOLUR??",
                length: 13
              },
              {
                points: "gvqtGdvzkV]Z[VGFaAz@yClCm@h@o@l@c@`@UXMPMP",
                length: 12
              },
              {
                points:
                  "ydrtGbd{kVQXORS^gAxBU`@i@bAS^[ZSJGBIBYDM?MAGASGSM_@[YUKIMIOGQEW?S@",
                length: 26
              },
              {
                points: "uurtGzl{kVA?QFQHQNWZcClDINQ\\ELCF",
                length: 11
              },
              {
                points: "o}rtGjv{kVCH[|@EP[p@Wd@]d@w@bA",
                length: 8
              },
              {
                points: "_cstGf_|kVy@dAgBzBaBrBq@z@U^AD",
                length: 7
              },
              {
                points: "mmstG~k|kVIPKRGPSt@Id@EP?B",
                length: 8
              },
              {
                points: "oostGhq|kVGf@AVCl@@b@Bz@HxA?J",
                length: 8
              },
              {
                points: "mostG|z|kV@hA@nA?~@",
                length: 4
              },
              {
                points: "iostGva}kV?TC`E?`DA^",
                length: 5
              },
              {
                points: "oostGpn}kV?N?lCAnE",
                length: 4
              },
              {
                points: "qostG~y}kV?XI?qA@q@AoB?}A@",
                length: 7
              }
            ],
            alerts: [
              {
                alertDescriptionText:
                  "The stop at SW Columbia & 1st (Stop ID 12795) is closed long-term for construction. Use the temporary stop at SW Columbia & 2nd (Stop ID 14053). ",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1546623687000
              }
            ],
            routeShortName: "55",
            routeLongName: "Hamilton",
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: true,
            duration: 1225,
            intermediateStops: [
              {
                name: "SW Naito Parkway & Harrison",
                stopId: "TriMet:1927",
                stopCode: "1927",
                lon: -122.676956,
                lat: 45.509704,
                arrival: 1574126411000,
                departure: 1574126411000,
                zoneId: "B",
                stopIndex: 5,
                stopSequence: 6,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Naito Parkway & Sheridan",
                stopId: "TriMet:8770",
                stopCode: "8770",
                lon: -122.677673,
                lat: 45.506097,
                arrival: 1574126483000,
                departure: 1574126483000,
                zoneId: "B",
                stopIndex: 6,
                stopSequence: 7,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Barbur & Hamilton",
                stopId: "TriMet:173",
                stopCode: "173",
                lon: -122.678566,
                lat: 45.491037,
                arrival: 1574126786000,
                departure: 1574126786000,
                zoneId: "B",
                stopIndex: 7,
                stopSequence: 8,
                vertexType: "TRANSIT"
              },
              {
                name: "4900 Block SW Barbur",
                stopId: "TriMet:155",
                stopCode: "155",
                lon: -122.682757,
                lat: 45.487059,
                arrival: 1574126895000,
                departure: 1574126895000,
                zoneId: "B",
                stopIndex: 8,
                stopSequence: 9,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Capitol & Terwilliger",
                stopId: "TriMet:957",
                stopCode: "957",
                lon: -122.687337,
                lat: 45.480272,
                arrival: 1574127129000,
                departure: 1574127129000,
                zoneId: "B",
                stopIndex: 9,
                stopSequence: 10,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Capitol & Sunset",
                stopId: "TriMet:955",
                stopCode: "955",
                lon: -122.693219,
                lat: 45.478896,
                arrival: 1574127216000,
                departure: 1574127216000,
                zoneId: "B",
                stopIndex: 10,
                stopSequence: 11,
                vertexType: "TRANSIT"
              },
              {
                name: "1500 Block SW Sunset Blvd",
                stopId: "TriMet:5552",
                stopCode: "5552",
                lon: -122.694176,
                lat: 45.479613,
                arrival: 1574127240000,
                departure: 1574127240000,
                zoneId: "B",
                stopIndex: 11,
                stopSequence: 12,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & 18th Dr",
                stopId: "TriMet:5567",
                stopCode: "5567",
                lon: -122.696433,
                lat: 45.481935,
                arrival: 1574127286000,
                departure: 1574127286000,
                zoneId: "B",
                stopIndex: 12,
                stopSequence: 13,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & Boundary",
                stopId: "TriMet:5553",
                stopCode: "5553",
                lon: -122.697769,
                lat: 45.484599,
                arrival: 1574127340000,
                departure: 1574127340000,
                zoneId: "B",
                stopIndex: 13,
                stopSequence: 14,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & Mitchell",
                stopId: "TriMet:5562",
                stopCode: "5562",
                lon: -122.699361,
                lat: 45.485906,
                arrival: 1574127367000,
                departure: 1574127367000,
                zoneId: "B",
                stopIndex: 14,
                stopSequence: 15,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & Richardson",
                stopId: "TriMet:5564",
                stopCode: "5564",
                lon: -122.70075,
                lat: 45.486775,
                arrival: 1574127389000,
                departure: 1574127389000,
                zoneId: "B",
                stopIndex: 15,
                stopSequence: 16,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & 19th",
                stopId: "TriMet:5568",
                stopCode: "5568",
                lon: -122.702822,
                lat: 45.488436,
                arrival: 1574127425000,
                departure: 1574127425000,
                zoneId: "B",
                stopIndex: 16,
                stopSequence: 17,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & 26th Dr",
                stopId: "TriMet:5571",
                stopCode: "5571",
                lon: -122.703711,
                lat: 45.488778,
                arrival: 1574127436000,
                departure: 1574127436000,
                zoneId: "B",
                stopIndex: 17,
                stopSequence: 18,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & 27th",
                stopId: "TriMet:5572",
                stopCode: "5572",
                lon: -122.705267,
                lat: 45.488745,
                arrival: 1574127453000,
                departure: 1574127453000,
                zoneId: "B",
                stopIndex: 18,
                stopSequence: 19,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & 29th",
                stopId: "TriMet:5574",
                stopCode: "5574",
                lon: -122.706354,
                lat: 45.488754,
                arrival: 1574127466000,
                departure: 1574127466000,
                zoneId: "B",
                stopIndex: 19,
                stopSequence: 20,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & 31st Dr",
                stopId: "TriMet:5575",
                stopCode: "5575",
                lon: -122.708401,
                lat: 45.488758,
                arrival: 1574127489000,
                departure: 1574127489000,
                zoneId: "B",
                stopIndex: 20,
                stopSequence: 21,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Sunset Blvd & Dosch",
                stopId: "TriMet:5556",
                stopCode: "5556",
                lon: -122.710234,
                lat: 45.488793,
                arrival: 1574127510000,
                departure: 1574127510000,
                zoneId: "B",
                stopIndex: 21,
                stopSequence: 22,
                vertexType: "TRANSIT"
              }
            ],
            steps: []
          },
          {
            startTime: 1574127540000,
            endTime: 1574127589000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 62.04,
            pathway: false,
            mode: "WALK",
            route: "",
            agencyTimeZoneOffset: -28800000,
            interlineWithPreviousLeg: false,
            from: {
              name: "SW Dosch & Hamilton",
              stopId: "TriMet:1519",
              stopCode: "1519",
              lon: -122.710281,
              lat: 45.490477,
              arrival: 1574127540000,
              departure: 1574127540000,
              zoneId: "B",
              stopIndex: 22,
              stopSequence: 23,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Hamilton & Dosch",
              stopId: "TriMet:2467",
              stopCode: "2467",
              lon: -122.709816,
              lat: 45.490625,
              arrival: 1574127589000,
              departure: 1574129340000,
              zoneId: "B",
              stopIndex: 25,
              stopSequence: 26,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points: "mzstGzz}kVU??WI??E?}@?S",
              length: 7
            },
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: false,
            duration: 49,
            intermediateStops: [],
            steps: [
              {
                distance: 12.499,
                relativeDirection: "DEPART",
                streetName: "SW Dosch Rd",
                absoluteDirection: "NORTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.71037415995767,
                lat: 45.49047649493138,
                elevation: []
              },
              {
                distance: 49.541,
                relativeDirection: "RIGHT",
                streetName: "SW Hamilton St",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.7103754,
                lat: 45.4905889,
                elevation: [
                  {
                    first: 0,
                    second: 168.48284254544677
                  },
                  {
                    first: 9.42,
                    second: 169.49284254544676
                  },
                  {
                    first: 15.244,
                    second: 169.49284254544676
                  },
                  {
                    first: 21.073999999999998,
                    second: 169.5228425454468
                  }
                ]
              }
            ]
          },
          {
            startTime: 1574129340000,
            endTime: 1574129795000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 2568.2240193647112,
            pathway: false,
            mode: "BUS",
            route: "51",
            agencyName: "TriMet",
            agencyUrl: "http://trimet.org/",
            agencyTimeZoneOffset: -28800000,
            routeType: 3,
            routeId: "TriMet:51",
            interlineWithPreviousLeg: false,
            tripBlockId: "5106",
            headsign: "Portland",
            agencyId: "TRIMET",
            tripId: "TriMet:9493522",
            serviceDate: "20191118",
            from: {
              name: "SW Hamilton & Dosch",
              stopId: "TriMet:2467",
              stopCode: "2467",
              lon: -122.709816,
              lat: 45.490625,
              arrival: 1574127589000,
              departure: 1574129340000,
              zoneId: "B",
              stopIndex: 25,
              stopSequence: 26,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Ravensview & Terrace",
              stopId: "TriMet:4799",
              stopCode: "4799",
              lon: -122.700325,
              lat: 45.507525,
              arrival: 1574129795000,
              orig: "SW Ravensview & Terrace",
              zoneId: "B",
              stopIndex: 39,
              stopSequence: 40,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "c{stGjw}kV?nBoCC[@SBQDKH_@VA@QN[RIBM@K?IAIAKAICKEOEGCKCI?C?G?I@KHEBCDCDEHCHQj@?@Mb@INGNILKLIJMLKFQJMFQFSFKBG@a@Fm@DMBe@De@DM@c@@QAQAKCMGKEIGMMSUUUIIECGCGAIAG?G?G@C@A?YP]Tq@d@[Tc@\\oAhAa@\\KJIDMHOFIBG?I@K?GAKCKCEAOG[KuAc@_@OWIUK_@QCAYMQIGAIAK?Q?mAHMBK@GDKFIDKJURQLIBGBIDa@Le@LG@IDIBCDEBCDCFEJENOj@AHCD?@EFIPQWQWKKEGIGSQECGCKGYIEA]Ku@UMGIGIGGIEEEKCKEMAK?M?M@QFc@J_ABM@Q?Q@OAQAKAMEOIS]s@EMCIAGAGAIAG?G?CAM@S@I@K@G@Kv@aDRu@DS@S?QAOCMKSOU_@e@SWMQeAaB[g@EGi@_A]m@U]a@c@e@_@QMOOEICIAU@UBa@B[?WC]Cc@Gg@EWIa@]gAGQEKESAKCQAMAK?O?Q?UGa@GqAIeBCQEOEEEGIAGAG@GBCDGFW`@OTQP]V??UHSBM?KCm@QGCEECEAEAE?K@_@?e@?oCAGCKCEOMQKECCCCEAGEGCIAICKAMEQ",
              length: 279
            },
            interStopGeometry: [
              {
                points: "c{stGjw}kV?nBoCC[@SBQDKH_@VA@",
                length: 9
              },
              {
                points:
                  "ccttGf|}kVQN[RIBM@K?IAIAKAICKEOEGCKCI?C?G?I@KHEBCDCDEHCHQj@",
                length: 25
              },
              {
                points: "ekttGn_~kV?@Mb@INGNILKLIJMLKFQJMFQFSFKBG@a@Fm@DMB",
                length: 19
              },
              {
                points:
                  "wsttGne~kVe@De@DM@c@@QAQAKCMGKEIGMMSUUUIIECGCGAIAG?G?G@C@",
                length: 23
              },
              {
                points:
                  "g~ttGtb~kVA?YP]Tq@d@[Tc@\\oAhAa@\\KJIDMHOFIBG?I@K?GAKCKCEA",
                length: 21
              },
              {
                points: "gkutG|j~kVOG[KuAc@_@OWIUK_@Q",
                length: 8
              },
              {
                points:
                  "wrutGlg~kVCAYMQIGAIAK?Q?mAHMBK@GDKFIDKJURQLIBGBIDa@Le@LG@IDIBCDEBCDCFEJENOj@AHCD",
                length: 34
              },
              {
                points:
                  "eavtGfn~kV?@EFIPQWQWKKEGIGSQECGCKGYIEA]Ku@UMGIGIGGIEEEKCKEMAK?M?M@QFc@J_A",
                length: 31
              },
              {
                points: "cjvtGzb~kVBM@Q?Q@OAQAKAMEOIS]s@EMCIAGAGAIAG?G",
                length: 18
              },
              {
                points:
                  "alvtGrz}kV?CAM@S@I@K@G@Kv@aDRu@DS@S?QAOCMKSOU_@e@SWMQeAaB",
                length: 21
              },
              {
                points: "onvtGvg}kV[g@EGi@_A]m@U]a@c@e@_@",
                length: 8
              },
              {
                points: "wtvtGv_}kVQMOOEICIAU@UBa@B[?WC]Cc@Gg@EWIa@]gA",
                length: 16
              },
              {
                points:
                  "ywvtGvr|kVGQEKESAKCQAMAK?O?Q?UGa@GqAIeBCQEOEEEGIAGAG@GBCDGFW`@OTQP]V",
                length: 28
              },
              {
                points:
                  "m~vtG|h|kV??UHSBM?KCm@QGCEECEAEAE?K@_@?e@?oCAGCKCEOMQKECCCCEAGEGCIAICKAMEQ",
                length: 31
              }
            ],
            routeShortName: "51",
            routeLongName: "Vista",
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: true,
            duration: 455,
            intermediateStops: [
              {
                name: "SW Dosch & Newby",
                stopId: "TriMet:1523",
                stopCode: "1523",
                lon: -122.710434,
                lat: 45.491939,
                arrival: 1574129364000,
                departure: 1574129364000,
                zoneId: "B",
                stopIndex: 26,
                stopSequence: 27,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Dosch & Bridlemile",
                stopId: "TriMet:1516",
                stopCode: "1516",
                lon: -122.711088,
                lat: 45.493187,
                arrival: 1574129385000,
                departure: 1574129385000,
                zoneId: "B",
                stopIndex: 27,
                stopSequence: 28,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Dosch & Martins",
                stopId: "TriMet:1521",
                stopCode: "1521",
                lon: -122.711965,
                lat: 45.494535,
                arrival: 1574129407000,
                departure: 1574129407000,
                zoneId: "B",
                stopIndex: 28,
                stopSequence: 29,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Dosch & Dosch Ct",
                stopId: "TriMet:1518",
                stopCode: "1518",
                lon: -122.711547,
                lat: 45.496225,
                arrival: 1574129433000,
                departure: 1574129433000,
                zoneId: "B",
                stopIndex: 29,
                stopSequence: 30,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Dosch & Doschview",
                stopId: "TriMet:13571",
                stopCode: "13571",
                lon: -122.712831,
                lat: 45.498255,
                arrival: 1574129465000,
                departure: 1574129465000,
                zoneId: "B",
                stopIndex: 30,
                stopSequence: 31,
                vertexType: "TRANSIT"
              },
              {
                name: "3300 Block SW Dosch",
                stopId: "TriMet:8416",
                stopCode: "8416",
                lon: -122.712319,
                lat: 45.499467,
                arrival: 1574129483000,
                departure: 1574129483000,
                zoneId: "B",
                stopIndex: 31,
                stopSequence: 32,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Dosch & Patton",
                stopId: "TriMet:1524",
                stopCode: "1524",
                lon: -122.713415,
                lat: 45.501845,
                arrival: 1574129520000,
                departure: 1574129520000,
                zoneId: "B",
                stopIndex: 32,
                stopSequence: 33,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Patton & Patton Ct",
                stopId: "TriMet:4422",
                stopCode: "4422",
                lon: -122.711676,
                lat: 45.503173,
                arrival: 1574129568000,
                departure: 1574129568000,
                zoneId: "B",
                stopIndex: 33,
                stopSequence: 34,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Patton & Patton Ln",
                stopId: "TriMet:4424",
                stopCode: "4424",
                lon: -122.710319,
                lat: 45.50346,
                arrival: 1574129589000,
                departure: 1574129589000,
                zoneId: "B",
                stopIndex: 34,
                stopSequence: 35,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Patton & Old Orchard",
                stopId: "TriMet:4420",
                stopCode: "4420",
                lon: -122.707248,
                lat: 45.50387,
                arrival: 1574129640000,
                departure: 1574129640000,
                zoneId: "B",
                stopIndex: 35,
                stopSequence: 36,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Patton & Homar",
                stopId: "TriMet:4416",
                stopCode: "4416",
                lon: -122.705985,
                lat: 45.504904,
                arrival: 1574129667000,
                departure: 1574129667000,
                zoneId: "B",
                stopIndex: 36,
                stopSequence: 37,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Patton & Greenway",
                stopId: "TriMet:4415",
                stopCode: "4415",
                lon: -122.703901,
                lat: 45.505355,
                arrival: 1574129700000,
                departure: 1574129700000,
                zoneId: "B",
                stopIndex: 37,
                stopSequence: 38,
                vertexType: "TRANSIT"
              },
              {
                name: "2600 Block SW Ravensview",
                stopId: "TriMet:13572",
                stopCode: "13572",
                lon: -122.702323,
                lat: 45.506493,
                arrival: 1574129749000,
                departure: 1574129749000,
                zoneId: "B",
                stopIndex: 38,
                stopSequence: 39,
                vertexType: "TRANSIT"
              }
            ],
            steps: []
          }
        ],
        tooSloped: false
      },
      {
        duration: 5860,
        startTime: 1574125054000,
        endTime: 1574130914000,
        walkTime: 1024,
        transitTime: 1933,
        waitingTime: 2903,
        walkDistance: 1278.4329552168076,
        walkLimitExceeded: false,
        elevationLost: 14.73999999999998,
        elevationGained: 17.169999999999987,
        transfers: 1,
        fare: {
          fare: {
            regular: {
              currency: {
                symbol: "$",
                currency: "USD",
                defaultFractionDigits: 2,
                currencyCode: "USD"
              },
              cents: 250
            }
          },
          details: {}
        },
        legs: [
          {
            startTime: 1574125054000,
            endTime: 1574125439000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 466.016,
            pathway: false,
            mode: "WALK",
            route: "",
            agencyTimeZoneOffset: -28800000,
            interlineWithPreviousLeg: false,
            from: {
              name: "3520 NE Broadway, Portland, OR, USA 97232",
              lon: -122.62763465127287,
              lat: 45.534701774459776,
              departure: 1574125054000,
              orig: "3520 NE Broadway, Portland, OR, USA 97232",
              vertexType: "NORMAL"
            },
            to: {
              name: "NE Sandy & Cesar Chavez Blvd",
              stopId: "TriMet:11313",
              stopCode: "11313",
              lon: -122.622754,
              lat: 45.535039,
              arrival: 1574125439000,
              departure: 1574125440000,
              zoneId: "B",
              stopIndex: 22,
              stopSequence: 23,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "}n|tGtumkVy@@D??Ac@AA}H?q@?k@?uA?U?Q?[?E?M?_@?iBAmB?O?u@ASL?BATMVCISGU",
              length: 26
            },
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: false,
            duration: 385,
            intermediateStops: [],
            steps: [
              {
                distance: 49.491,
                relativeDirection: "DEPART",
                streetName: "service road",
                absoluteDirection: "NORTH",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.62762443819214,
                lat: 45.53471487200395,
                elevation: [
                  {
                    first: 0,
                    second: 41.89284254544678
                  },
                  {
                    first: 10,
                    second: 42.03284254544678
                  },
                  {
                    first: 20,
                    second: 42.212842545446776
                  },
                  {
                    first: 28.79,
                    second: 42.20284254544678
                  },
                  {
                    first: 28.791,
                    second: 41.89284254544678
                  },
                  {
                    first: 38.791,
                    second: 41.98284254544678
                  },
                  {
                    first: 49.491,
                    second: 41.932842545446775
                  }
                ]
              },
              {
                distance: 360.30400000000003,
                relativeDirection: "RIGHT",
                streetName: "NE Broadway",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6276191,
                lat: 45.5351574,
                elevation: [
                  {
                    first: 0,
                    second: 41.932842545446775
                  },
                  {
                    first: 10,
                    second: 42.03284254544678
                  },
                  {
                    first: 20,
                    second: 42.13284254544678
                  },
                  {
                    first: 30,
                    second: 42.24284254544678
                  },
                  {
                    first: 40,
                    second: 42.27284254544678
                  },
                  {
                    first: 50,
                    second: 42.22284254544678
                  },
                  {
                    first: 60,
                    second: 42.24284254544678
                  },
                  {
                    first: 70,
                    second: 42.28284254544678
                  },
                  {
                    first: 80,
                    second: 42.36284254544678
                  },
                  {
                    first: 90,
                    second: 42.42284254544678
                  },
                  {
                    first: 100,
                    second: 42.45284254544678
                  },
                  {
                    first: 110,
                    second: 42.51284254544677
                  },
                  {
                    first: 124.07,
                    second: 42.58284254544678
                  },
                  {
                    first: 124.066,
                    second: 42.58284254544678
                  },
                  {
                    first: 134.066,
                    second: 42.77284254544678
                  },
                  {
                    first: 143.406,
                    second: 43.00284254544678
                  },
                  {
                    first: 143.405,
                    second: 43.00284254544678
                  },
                  {
                    first: 153.405,
                    second: 43.26284254544677
                  },
                  {
                    first: 161.035,
                    second: 43.44284254544678
                  },
                  {
                    first: 161.031,
                    second: 43.44284254544678
                  },
                  {
                    first: 171.031,
                    second: 43.69284254544678
                  },
                  {
                    first: 181.031,
                    second: 43.962842545446776
                  },
                  {
                    first: 191.031,
                    second: 44.072842545446775
                  },
                  {
                    first: 202.591,
                    second: 44.20284254544678
                  },
                  {
                    first: 223.11200000000002,
                    second: 44.48284254544678
                  },
                  {
                    first: 228.79200000000003,
                    second: 44.63284254544678
                  },
                  {
                    first: 228.79000000000002,
                    second: 44.63284254544678
                  },
                  {
                    first: 241.18,
                    second: 44.80284254544678
                  },
                  {
                    first: 241.175,
                    second: 44.80284254544678
                  },
                  {
                    first: 251.175,
                    second: 44.92284254544678
                  },
                  {
                    first: 261.175,
                    second: 45.05284254544678
                  },
                  {
                    first: 271.175,
                    second: 45.17284254544678
                  },
                  {
                    first: 282.265,
                    second: 45.28284254544678
                  },
                  {
                    first: 282.265,
                    second: 45.28284254544678
                  },
                  {
                    first: 292.265,
                    second: 45.34284254544678
                  },
                  {
                    first: 302.265,
                    second: 45.39284254544678
                  },
                  {
                    first: 312.265,
                    second: 45.49284254544678
                  },
                  {
                    first: 325.015,
                    second: 45.63284254544678
                  },
                  {
                    first: 325.019,
                    second: 45.63284254544678
                  },
                  {
                    first: 331.23900000000003,
                    second: 45.66284254544678
                  },
                  {
                    first: 331.242,
                    second: 45.66284254544678
                  },
                  {
                    first: 341.242,
                    second: 45.44284254544678
                  },
                  {
                    first: 351.242,
                    second: 45.49284254544678
                  },
                  {
                    first: 360.312,
                    second: 45.64284254544678
                  }
                ]
              },
              {
                distance: 36.624,
                relativeDirection: "RIGHT",
                streetName: "NE Cesar E. Chavez Blvd",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6229946,
                lat: 45.5351838,
                elevation: [
                  {
                    first: 0,
                    second: 45.64284254544678
                  },
                  {
                    first: 10,
                    second: 45.67284254544678
                  },
                  {
                    first: 20,
                    second: 45.51284254544677
                  },
                  {
                    first: 30,
                    second: 45.56284254544678
                  },
                  {
                    first: 36.64,
                    second: 45.52284254544678
                  }
                ]
              },
              {
                distance: 19.597,
                relativeDirection: "HARD_LEFT",
                streetName: "NE Sandy Blvd",
                absoluteDirection: "NORTHEAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.6228985,
                lat: 45.5348661,
                elevation: []
              }
            ]
          },
          {
            startTime: 1574125440000,
            endTime: 1574126561000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 4481.121976209744,
            pathway: false,
            mode: "BUS",
            route: "12",
            agencyName: "TriMet",
            agencyUrl: "http://trimet.org/",
            agencyTimeZoneOffset: -28800000,
            routeType: 3,
            routeId: "TriMet:12",
            interlineWithPreviousLeg: false,
            tripBlockId: "1267",
            headsign: "Tigard TC via Portland City Center",
            agencyId: "TRIMET",
            tripId: "TriMet:9488309",
            serviceDate: "20191118",
            from: {
              name: "NE Sandy & Cesar Chavez Blvd",
              stopId: "TriMet:11313",
              stopCode: "11313",
              lon: -122.622754,
              lat: 45.535039,
              arrival: 1574125439000,
              departure: 1574125440000,
              zoneId: "B",
              stopIndex: 22,
              stopSequence: 23,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW 5th & Pine",
              stopId: "TriMet:7631",
              stopCode: "7631",
              lon: -122.675827,
              lat: 45.522236,
              arrival: 1574126561000,
              departure: 1574126561000,
              zoneId: "B",
              stopIndex: 37,
              stopSequence: 39,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "mp|tGxvlkVFTHR^nAj@fBFRFPPh@L^L^V~@@Tz@tCJZLNTr@\\hAx@rCdAhDPj@dAjD|@zCNd@Nd@FRN`@FTX|@J^Tv@d@bB`A~CDNRt@Nj@tA~ERp@`@tAHZTv@Lf@HRBJNd@n@|B@BPp@FRLb@\\lAh@lBNh@Ph@n@zB^rAj@pB\\rA\\hA@HL`@DNFRHTTr@j@lBdAvDFPDNZdAl@hBJb@`@zAX`ADTFP`@|A`@zAjAjEDRRr@FVf@jBx@xCHXHXFVd@|A^pALb@BZf@dB??HXDJ@F@H?F@B?J?D?\\?zB?hB?t@?L?\\AhE?hE?jEAhE?nD?X?pB?xA?RAjD?J?Z?dC?R?XAJ?P?R@H@FBFBFBDDDBBDBF@F?d@@H@D@FBDB@@@BBD@FBJ@LFTCjCEhHGzLAzAAxAG`LA`AAhC?LAnAGRAlBAXBhEBjE@fEVCJAF@F@b@NPHDBF@`A^",
              length: 171
            },
            interStopGeometry: [
              {
                points:
                  "mp|tGxvlkVFTHR^nAj@fBFRFPPh@L^L^V~@@Tz@tCJZLNTr@\\hAx@rCdAhDPj@",
                length: 20
              },
              {
                points: "{a|tGjzmkVdAjD|@zCNd@Nd@",
                length: 5
              },
              {
                points: "w|{tG~fnkVFRN`@FTX|@J^Tv@d@bB`A~CDNRt@",
                length: 11
              },
              {
                points: "yu{tGjxnkVNj@tA~ERp@`@tAHZTv@Lf@HRBJNd@n@|B",
                length: 12
              },
              {
                points: "am{tG~nokV@BPp@FRLb@\\lAh@lBNh@Ph@n@zB^rA",
                length: 11
              },
              {
                points: "}e{tGlapkVj@pB\\rA\\hA@H",
                length: 5
              },
              {
                points: "sb{tGfjpkVL`@DNFRHTTr@j@lBdAvDFPDNZdAl@hBJb@`@zA",
                length: 14
              },
              {
                points: "_yztGnbqkVX`ADTFP`@|A`@zAjAjEDRRr@",
                length: 9
              },
              {
                points: "mrztGftqkVFVf@jBx@xC",
                length: 4
              },
              {
                points: "coztGd}qkVHXHXFVd@|A^pALb@BZf@dB",
                length: 9
              },
              {
                points: "gjztGfjrkV??HXDJ@F@H?F@B?J?D?\\?zB?hB?t@",
                length: 14
              },
              {
                points: "qiztGvvrkV?L?\\AhE?hE?jEAhE?nD",
                length: 8
              },
              {
                points: "uiztG|vskV?X?pB?xA?RAjD?J?Z?dC",
                length: 9
              },
              {
                points:
                  "wiztGpitkV?R?XAJ?P?R@H@FBFBFBDDDBBDBF@F?d@@H@D@FBDB@@@BBD@FBJ@LFTCjCEhHGzLAzAAxAG`LA`AAhC?L",
                length: 37
              },
              {
                points: "ofztG~evkVAnAGRAlBAXBhEBjE@fEVCJAF@F@b@NPHDBF@`A^",
                length: 17
              }
            ],
            alerts: [
              {
                alertDescriptionText:
                  "For trips to Tigard Transit Center, no service to the stop at NE Sandy & 91st (Stop ID 5145) due to PBOT sidewalk construction. Use temporary stop on the west side of 91st.  ",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1564601290000
              },
              {
                alertDescriptionText:
                  "No service to the westbound stop at W Burnside & Burnside Bridge (Stop ID 689) due to long-term construction. Use temporary stop at W Burnside & 2nd (Stop ID 14057). ",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1553112419000
              },
              {
                alertDescriptionText:
                  "For trips to Parkrose/Sumner Transit Center, no service to the stop at NE Sandy & 47th (Stop ID 5094) due to long-term construction. Use the temporary stop located at NE Sandy & 48th (Stop ID 14073).",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1562950483000
              },
              {
                alertDescriptionText:
                  "Beginning at 3:30 a.m. on Monday, November 11, until end of service on Friday, November 22, no service to the eastbound stop at NE Sandy & 31st (Stop ID 5076) or the westbound stop at NE Sandy & 31st (Stop ID 5077) due to pedestrian crossing construction. ",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1573385400000
              },
              {
                alertDescriptionText:
                  "No service to the stops in both directions at SW Barbur & Lane (Stop IDs 176 and 177) due to construction. Use the temporary stops placed 100 feet past both closed stops.",
                alertUrl: "http://trimet.org/alerts/",
                effectiveStartDate: 1569343132000
              }
            ],
            routeShortName: "12",
            routeLongName: "Barbur/Sandy Blvd",
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: true,
            duration: 1121,
            intermediateStops: [
              {
                name: "NE Sandy & 35th",
                stopId: "TriMet:5081",
                stopCode: "5081",
                lon: -122.628436,
                lat: 45.532691,
                arrival: 1574125554000,
                departure: 1574125554000,
                zoneId: "B",
                stopIndex: 23,
                stopSequence: 24,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 33rd",
                stopId: "TriMet:5080",
                stopCode: "5080",
                lon: -122.63045,
                lat: 45.531875,
                arrival: 1574125594000,
                departure: 1574125594000,
                zoneId: "B",
                stopIndex: 24,
                stopSequence: 25,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 31st",
                stopId: "TriMet:5077",
                stopCode: "5077",
                lon: -122.63324,
                lat: 45.530785,
                arrival: 1574125649000,
                departure: 1574125649000,
                zoneId: "B",
                stopIndex: 25,
                stopSequence: 26,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 28th",
                stopId: "TriMet:5069",
                stopCode: "5069",
                lon: -122.63686,
                lat: 45.52938,
                arrival: 1574125719000,
                departure: 1574125719000,
                zoneId: "B",
                stopIndex: 26,
                stopSequence: 27,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 26th",
                stopId: "TriMet:5068",
                stopCode: "5068",
                lon: -122.6398,
                lat: 45.528232,
                arrival: 1574125777000,
                departure: 1574125777000,
                zoneId: "B",
                stopIndex: 27,
                stopSequence: 28,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 24th",
                stopId: "TriMet:5067",
                stopCode: "5067",
                lon: -122.641209,
                lat: 45.527695,
                arrival: 1574125805000,
                departure: 1574125805000,
                zoneId: "B",
                stopIndex: 28,
                stopSequence: 29,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 20th",
                stopId: "TriMet:5063",
                stopCode: "5063",
                lon: -122.645089,
                lat: 45.526155,
                arrival: 1574125881000,
                departure: 1574125881000,
                zoneId: "B",
                stopIndex: 29,
                stopSequence: 30,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 18th",
                stopId: "TriMet:5062",
                stopCode: "5062",
                lon: -122.647926,
                lat: 45.525106,
                arrival: 1574125936000,
                departure: 1574125936000,
                zoneId: "B",
                stopIndex: 30,
                stopSequence: 31,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 16th",
                stopId: "TriMet:5060",
                stopCode: "5060",
                lon: -122.649367,
                lat: 45.524581,
                arrival: 1574125964000,
                departure: 1574125964000,
                zoneId: "B",
                stopIndex: 31,
                stopSequence: 32,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Sandy & 14th",
                stopId: "TriMet:5058",
                stopCode: "5058",
                lon: -122.651428,
                lat: 45.523767,
                arrival: 1574126005000,
                departure: 1574126005000,
                zoneId: "B",
                stopIndex: 32,
                stopSequence: 33,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Couch & 12th",
                stopId: "TriMet:13328",
                stopCode: "13328",
                lon: -122.653391,
                lat: 45.523661,
                arrival: 1574126040000,
                departure: 1574126040000,
                zoneId: "B",
                stopIndex: 33,
                stopSequence: 34,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Couch & 7th",
                stopId: "TriMet:13329",
                stopCode: "13329",
                lon: -122.658549,
                lat: 45.523691,
                arrival: 1574126124000,
                departure: 1574126124000,
                zoneId: "B",
                stopIndex: 34,
                stopSequence: 35,
                vertexType: "TRANSIT"
              },
              {
                name: "NE Couch & M L King",
                stopId: "TriMet:13330",
                stopCode: "13330",
                lon: -122.661524,
                lat: 45.523703,
                arrival: 1574126172000,
                departure: 1574126172000,
                zoneId: "B",
                stopIndex: 35,
                stopSequence: 36,
                vertexType: "TRANSIT"
              },
              {
                name: "W Burnside & Burnside Bridge",
                stopId: "TriMet:689",
                stopCode: "689",
                lon: -122.671007,
                lat: 45.52325,
                arrival: 1574126340000,
                departure: 1574126340000,
                zoneId: "B",
                stopIndex: 36,
                stopSequence: 38,
                vertexType: "TRANSIT"
              }
            ],
            steps: []
          },
          {
            startTime: 1574126561000,
            endTime: 1574126767000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 273.308,
            pathway: false,
            mode: "WALK",
            route: "",
            agencyTimeZoneOffset: -28800000,
            interlineWithPreviousLeg: false,
            from: {
              name: "SW 5th & Pine",
              stopId: "TriMet:7631",
              stopCode: "7631",
              lon: -122.675827,
              lat: 45.522236,
              arrival: 1574126561000,
              departure: 1574126561000,
              zoneId: "B",
              stopIndex: 37,
              stopSequence: 39,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Washington & 5th",
              stopId: "TriMet:6160",
              stopCode: "6160",
              lon: -122.676586,
              lat: 45.520126,
              arrival: 1574126767000,
              departure: 1574129668000,
              zoneId: "B",
              stopIndex: 2,
              stopSequence: 3,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points: "}`ztG`cwkV@?DM@IJDJBhBx@NFNJxAl@JDNFLFhBx@JDBOFY",
              length: 17
            },
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: false,
            duration: 206,
            intermediateStops: [],
            steps: [
              {
                distance: 11.476,
                relativeDirection: "DEPART",
                streetName: "path",
                absoluteDirection: "SOUTHEAST",
                stayOn: false,
                area: false,
                bogusName: true,
                lon: -122.67584862677161,
                lat: 45.52223400944855,
                elevation: []
              },
              {
                distance: 244.491,
                relativeDirection: "RIGHT",
                streetName: "SW 5th Ave",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.67573,
                lat: 45.5221843,
                elevation: [
                  {
                    first: 0,
                    second: 8.322842545446779
                  },
                  {
                    first: 6.44,
                    second: 8.112842545446778
                  },
                  {
                    first: 6.444,
                    second: 8.112842545446778
                  },
                  {
                    first: 14.213999999999999,
                    second: 8.322842545446779
                  },
                  {
                    first: 14.215,
                    second: 8.322842545446779
                  },
                  {
                    first: 24.215,
                    second: 8.352842545446778
                  },
                  {
                    first: 34.215,
                    second: 8.402842545446779
                  },
                  {
                    first: 44.215,
                    second: 8.442842545446778
                  },
                  {
                    first: 54.215,
                    second: 8.372842545446778
                  },
                  {
                    first: 64.215,
                    second: 8.452842545446778
                  },
                  {
                    first: 76.955,
                    second: 8.252842545446779
                  },
                  {
                    first: 76.955,
                    second: 8.252842545446779
                  },
                  {
                    first: 86.185,
                    second: 8.242842545446779
                  },
                  {
                    first: 157.085,
                    second: 8.702842545446778
                  },
                  {
                    first: 165.465,
                    second: 8.762842545446778
                  },
                  {
                    first: 165.461,
                    second: 8.762842545446778
                  },
                  {
                    first: 173.841,
                    second: 8.832842545446779
                  },
                  {
                    first: 173.83800000000002,
                    second: 8.832842545446779
                  },
                  {
                    first: 183.83800000000002,
                    second: 8.902842545446779
                  },
                  {
                    first: 193.83800000000002,
                    second: 9.042842545446778
                  },
                  {
                    first: 203.83800000000002,
                    second: 9.132842545446778
                  },
                  {
                    first: 213.83800000000002,
                    second: 9.312842545446777
                  },
                  {
                    first: 223.83800000000002,
                    second: 9.412842545446779
                  },
                  {
                    first: 237.65800000000002,
                    second: 9.442842545446778
                  },
                  {
                    first: 237.656,
                    second: 9.442842545446778
                  },
                  {
                    first: 244.496,
                    second: 9.452842545446778
                  }
                ]
              },
              {
                distance: 17.341,
                relativeDirection: "LEFT",
                streetName: "SW Washington St",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.676825,
                lat: 45.5201247,
                elevation: [
                  {
                    first: 0,
                    second: 9.452842545446778
                  },
                  {
                    first: 6.26,
                    second: 9.552842545446778
                  }
                ]
              }
            ]
          },
          {
            startTime: 1574129668000,
            endTime: 1574130480000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 3871.4726878482074,
            pathway: false,
            mode: "BUS",
            route: "51",
            agencyName: "TriMet",
            agencyUrl: "http://trimet.org/",
            agencyTimeZoneOffset: -28800000,
            routeType: 3,
            routeId: "TriMet:51",
            interlineWithPreviousLeg: false,
            tripBlockId: "5104",
            headsign: "Council Crest and Dosch Rd",
            agencyId: "TRIMET",
            tripId: "TriMet:9493504",
            serviceDate: "20191118",
            from: {
              name: "SW Washington & 5th",
              stopId: "TriMet:6160",
              stopCode: "6160",
              lon: -122.676586,
              lat: 45.520126,
              arrival: 1574126767000,
              departure: 1574129668000,
              zoneId: "B",
              stopIndex: 2,
              stopSequence: 3,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Vista & Broadway",
              stopId: "TriMet:6068",
              stopCode: "6068",
              lon: -122.703903,
              lat: 45.505533,
              arrival: 1574130480000,
              departure: 1574130481000,
              zoneId: "B",
              stopIndex: 21,
              stopSequence: 22,
              vertexType: "TRANSIT"
            },
            legGeometry: {
              points:
                "ksytGzgwkVKh@ABw@rEADs@~Ds@fE[fBSjAERWxAAFg@rCOv@LF`Bt@HBLFHDtB~@CTe@lCKh@ERm@rDGZ_@zBI`@EVERi@~CCLO`AO|@G\\EPCNG\\i@|CCLERi@|CEVLRh@TRHh@ZXNhBv@JFJFRJFDFFFH@@`@XFDh@b@RNa@zBWvAq@|DSfACNKj@[hBa@|Bo@A@dC?^?lA?b@?x@?j@?p@?`CLAN?P?|A?J?vB@@?@?FCD?BCHCBCTKnFmCJGJGJE`@W^[PSHGBEBEFMXi@HSBEFEDEFCJEnAa@vAg@LCFADAD@F@FBDDHHHTX`AJXBHPZHJFHPLf@b@p@d@DDFDB?B?D?DABCBCDIBGBIXaBBIDKBGDGBEHGDCFCDADAFADAD@F@H@HDbBt@lElB^PtB~@vB`ALFdCfArB|@NHHBhBz@LHHJBFBF@H@JBt@@HBDbAdBNXBF?D@LLdD@j@B^VtC@^@P?`@MhA@RBN@FPRf@h@BFDH@HBJB^?F@FBDDDB@H@D?^QlBEPAxBIzDs@HC",
              length: 213
            },
            interStopGeometry: [
              {
                points: "ksytGzgwkVKh@ABw@rEADs@~Ds@fE[fBSjA",
                length: 9
              },
              {
                points: "kzytG~axkVERWxAAFg@rCOv@LF`Bt@",
                length: 8
              },
              {
                points: "syytG~mxkVHBLFHDtB~@CTe@lC",
                length: 7
              },
              {
                points: "evytGtuxkVKh@ERm@rDGZ_@zB",
                length: 6
              },
              {
                points: "myytG~aykVI`@EVERi@~CCLO`AO|@G\\",
                length: 9
              },
              {
                points: "y|ytGxnykVEPCNG\\i@|CCLERi@|CEVLRh@T",
                length: 11
              },
              {
                points: "w~ytGx}ykVRHh@ZXNhBv@JFJFRJFDFFFH@@`@XFD",
                length: 14
              },
              {
                points: "euytG|czkVh@b@RNa@zBWvAq@|DSfA",
                length: 7
              },
              {
                points: "gwytGjtzkVCNKj@[hBa@|Bo@A@dC?^?lA",
                length: 9
              },
              {
                points: "c{ytG`e{kV?b@?x@?j@?p@?`CLAN?P?",
                length: 9
              },
              {
                points: "syytG|n{kV|A?J?vB@@?",
                length: 5
              },
              {
                points: "orytG~n{kV@?FCD?BCHCBCTKnFmC",
                length: 9
              },
              {
                points:
                  "giytGti{kVJGJGJE`@W^[PSHGBEBEFMXi@HSBEFEDEFCJEnAa@vAg@LCFADAD@F@FBDDHHHTX`AJX",
                length: 31
              },
              {
                points:
                  "qyxtGrd{kVBHPZHJFHPLf@b@p@d@DDFDB?B?D?DABCBCDIBGBIXaBBIDKBGDGBEHGDCFCDADAFADAD@F@H@HDbBt@lElB^P",
                length: 39
              },
              {
                points: "mdxtGhi{kVtB~@vB`A",
                length: 3
              },
              {
                points: "_}wtGjm{kVLFdCfArB|@",
                length: 4
              },
              {
                points: "wtwtGxq{kVNHHBhBz@LHHJBFBF@H@JBt@@HBDbAdBNXBF?D@LLdD",
                length: 19
              },
              {
                points:
                  "}kwtGfb|kV@j@B^VtC@^@P?`@MhA@RBN@FPRf@h@BFDH@HBJB^?F@FBDDDB@H@D?^QlBE",
                length: 27
              },
              {
                points: "ecwtG`t|kVPAxBIzDs@HC",
                length: 5
              }
            ],
            routeShortName: "51",
            routeLongName: "Vista",
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: true,
            duration: 812,
            intermediateStops: [
              {
                name: "SW Washington & 9th",
                stopId: "TriMet:6169",
                stopCode: "6169",
                lon: -122.680765,
                lat: 45.521236,
                arrival: 1574129760000,
                departure: 1574129760000,
                zoneId: "B",
                stopIndex: 3,
                stopSequence: 4,
                vertexType: "TRANSIT"
              },
              {
                name: "SW 11th & Alder",
                stopId: "TriMet:9600",
                stopCode: "9600",
                lon: -122.682819,
                lat: 45.521094,
                arrival: 1574129804000,
                departure: 1574129804000,
                zoneId: "B",
                stopIndex: 4,
                stopSequence: 5,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Morrison & 12th",
                stopId: "TriMet:9598",
                stopCode: "9598",
                lon: -122.683933,
                lat: 45.52055,
                arrival: 1574129839000,
                departure: 1574129839000,
                zoneId: "B",
                stopIndex: 5,
                stopSequence: 6,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Morrison & 14th",
                stopId: "TriMet:9708",
                stopCode: "9708",
                lon: -122.685888,
                lat: 45.521078,
                arrival: 1574129874000,
                departure: 1574129874000,
                zoneId: "B",
                stopIndex: 6,
                stopSequence: 7,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Morrison & 16th",
                stopId: "TriMet:9613",
                stopCode: "9613",
                lon: -122.687932,
                lat: 45.521641,
                arrival: 1574129912000,
                departure: 1574129912000,
                zoneId: "B",
                stopIndex: 7,
                stopSequence: 8,
                vertexType: "TRANSIT"
              },
              {
                name: "SW 18th & Morrison",
                stopId: "TriMet:6911",
                stopCode: "6911",
                lon: -122.690453,
                lat: 45.52188,
                arrival: 1574129959000,
                departure: 1574129959000,
                zoneId: "B",
                stopIndex: 8,
                stopSequence: 9,
                vertexType: "TRANSIT"
              },
              {
                name: "SW 18th & Salmon",
                stopId: "TriMet:9553",
                stopCode: "9553",
                lon: -122.691399,
                lat: 45.520377,
                arrival: 1574130000000,
                departure: 1574130000000,
                zoneId: "B",
                stopIndex: 9,
                stopSequence: 10,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Salmon & 20th",
                stopId: "TriMet:5018",
                stopCode: "5018",
                lon: -122.693948,
                lat: 45.520733,
                arrival: 1574130040000,
                departure: 1574130040000,
                zoneId: "B",
                stopIndex: 10,
                stopSequence: 11,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Park Pl & St Clair",
                stopId: "TriMet:4340",
                stopCode: "4340",
                lon: -122.69664,
                lat: 45.521348,
                arrival: 1574130081000,
                departure: 1574130081000,
                zoneId: "B",
                stopIndex: 11,
                stopSequence: 12,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Park Pl",
                stopId: "TriMet:6090",
                stopCode: "6090",
                lon: -122.698287,
                lat: 45.521064,
                arrival: 1574130106000,
                departure: 1574130106000,
                zoneId: "B",
                stopIndex: 12,
                stopSequence: 13,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Madison",
                stopId: "TriMet:6082",
                stopCode: "6082",
                lon: -122.698276,
                lat: 45.519926,
                arrival: 1574130128000,
                departure: 1574130128000,
                zoneId: "B",
                stopIndex: 13,
                stopSequence: 14,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Market Street",
                stopId: "TriMet:6085",
                stopCode: "6085",
                lon: -122.697457,
                lat: 45.518427,
                arrival: 1574130158000,
                departure: 1574130158000,
                zoneId: "B",
                stopIndex: 14,
                stopSequence: 15,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Montgomery",
                stopId: "TriMet:6086",
                stopCode: "6086",
                lon: -122.69662,
                lat: 45.515994,
                arrival: 1574130215000,
                departure: 1574130215000,
                zoneId: "B",
                stopIndex: 15,
                stopSequence: 16,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Jackson",
                stopId: "TriMet:6078",
                stopCode: "6078",
                lon: -122.697391,
                lat: 45.512572,
                arrival: 1574130291000,
                departure: 1574130291000,
                zoneId: "B",
                stopIndex: 16,
                stopSequence: 17,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Myrtle",
                stopId: "TriMet:6088",
                stopCode: "6088",
                lon: -122.698035,
                lat: 45.511379,
                arrival: 1574130315000,
                departure: 1574130315000,
                zoneId: "B",
                stopIndex: 17,
                stopSequence: 18,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Elm St",
                stopId: "TriMet:6074",
                stopCode: "6074",
                lon: -122.698764,
                lat: 45.510062,
                arrival: 1574130342000,
                departure: 1574130342000,
                zoneId: "B",
                stopIndex: 18,
                stopSequence: 19,
                vertexType: "TRANSIT"
              },
              {
                name: "2500 Block SW Vista",
                stopId: "TriMet:13573",
                stopCode: "13573",
                lon: -122.701323,
                lat: 45.508676,
                arrival: 1574130390000,
                departure: 1574130390000,
                zoneId: "B",
                stopIndex: 19,
                stopSequence: 20,
                vertexType: "TRANSIT"
              },
              {
                name: "SW Vista & Isabella",
                stopId: "TriMet:6077",
                stopCode: "6077",
                lon: -122.704209,
                lat: 45.507233,
                arrival: 1574130448000,
                departure: 1574130448000,
                zoneId: "B",
                stopIndex: 20,
                stopSequence: 21,
                vertexType: "TRANSIT"
              }
            ],
            steps: []
          },
          {
            startTime: 1574130481000,
            endTime: 1574130914000,
            departureDelay: 0,
            arrivalDelay: 0,
            realTime: false,
            distance: 538.8249999999999,
            pathway: false,
            mode: "WALK",
            route: "",
            agencyTimeZoneOffset: -28800000,
            interlineWithPreviousLeg: false,
            from: {
              name: "SW Vista & Broadway",
              stopId: "TriMet:6068",
              stopCode: "6068",
              lon: -122.703903,
              lat: 45.505533,
              arrival: 1574130480000,
              departure: 1574130481000,
              zoneId: "B",
              stopIndex: 21,
              stopSequence: 22,
              vertexType: "TRANSIT"
            },
            to: {
              name: "SW Ravensview & Terrace",
              lon: -122.700325,
              lat: 45.507525,
              arrival: 1574130914000,
              orig: "SW Ravensview & Terrace",
              vertexType: "NORMAL"
            },
            legGeometry: {
              points:
                "qxvtGnr|kV@?@?JGCMGSCKAQAMAK?O?Q?UGa@GqAIeBCQEOEEEGIAGAG@GBCDGFW`@OTQP]VUHSBM?KCm@QGCEECEAEAE?K@_@?e@?oCAGCKCEOMQKECCCCGCECGCIAICKAMESEQJA@J@B",
              length: 63
            },
            rentedBike: false,
            rentedCar: false,
            rentedVehicle: false,
            hailedCar: false,
            transitLeg: false,
            duration: 433,
            intermediateStops: [],
            steps: [
              {
                distance: 16.156,
                relativeDirection: "DEPART",
                streetName: "SW Patton Rd (path)",
                absoluteDirection: "SOUTH",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.7039119063508,
                lat: 45.505535187298406,
                elevation: [
                  {
                    first: 10.009,
                    second: 219.12284254544676
                  },
                  {
                    first: 17.979,
                    second: 219.93284254544676
                  }
                ]
              },
              {
                distance: 52.78,
                relativeDirection: "CONTINUE",
                streetName: "SW Broadway Dr",
                absoluteDirection: "NORTHEAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.7038018,
                lat: 45.5054798,
                elevation: [
                  {
                    first: 0,
                    second: 219.3328425454468
                  },
                  {
                    first: 10,
                    second: 218.10284254544678
                  },
                  {
                    first: 20,
                    second: 217.5728425454468
                  },
                  {
                    first: 30,
                    second: 216.49284254544676
                  },
                  {
                    first: 40,
                    second: 215.85284254544678
                  },
                  {
                    first: 52.79,
                    second: 214.3828425454468
                  }
                ]
              },
              {
                distance: 100.607,
                relativeDirection: "SLIGHTLY_LEFT",
                streetName: "SW Ravensview Dr",
                absoluteDirection: "EAST",
                stayOn: false,
                area: false,
                bogusName: false,
                lon: -122.7031449,
                lat: 45.5055625,
                elevation: [
                  {
                    first: 0,
                    second: 214.3828425454468
                  },
                  {
                    first: 10,
                    second: 213.91284254544678
                  },
                  {
                    first: 20,
                    second: 213.4028425454468
                  },
                  {
                    first: 30,
                    second: 213.79284254544677
                  },
                  {
                    first: 40,
                    second: 214.03284254544678
                  },
                  {
                    first: 50,
                    second: 214.3928425454468
                  },
                  {
                    first: 60,
                    second: 215.0828425454468
                  },
                  {
                    first: 70,
                    second: 215.10284254544678
                  },
                  {
                    first: 80,
                    second: 215.1328425454468
                  },
                  {
                    first: 90,
                    second: 215.9028425454468
                  },
                  {
                    first: 100.61,
                    second: 215.75284254544675
                  }
                ]
              },
              {
                distance: 356.068,
                relativeDirection: "SLIGHTLY_LEFT",
                streetName: "SW Ravensview Dr",
                absoluteDirection: "NORTHEAST",
                stayOn: true,
                area: false,
                bogusName: false,
                lon: -122.7018879,
                lat: 45.5057404,
                elevation: [
                  {
                    first: 0,
                    second: 215.75284254544675
                  },
                  {
                    first: 10,
                    second: 217.05284254544677
                  },
                  {
                    first: 20,
                    second: 217.91284254544678
                  },
                  {
                    first: 30,
                    second: 219.04284254544677
                  },
                  {
                    first: 40,
                    second: 219.72284254544678
                  },
                  {
                    first: 50,
                    second: 220.1528425454468
                  },
                  {
                    first: 60,
                    second: 220.72284254544678
                  },
                  {
                    first: 70,
                    second: 221.48284254544677
                  },
                  {
                    first: 80,
                    second: 221.7628425454468
                  },
                  {
                    first: 90,
                    second: 222.1528425454468
                  },
                  {
                    first: 100,
                    second: 222.56284254544676
                  },
                  {
                    first: 110,
                    second: 222.8928425454468
                  },
                  {
                    first: 120,
                    second: 222.2728425454468
                  },
                  {
                    first: 130,
                    second: 222.48284254544677
                  },
                  {
                    first: 140,
                    second: 222.10284254544678
                  },
                  {
                    first: 150,
                    second: 222.3928425454468
                  },
                  {
                    first: 160,
                    second: 222.5728425454468
                  },
                  {
                    first: 170,
                    second: 222.87284254544676
                  },
                  {
                    first: 180,
                    second: 222.6528425454468
                  },
                  {
                    first: 190,
                    second: 223.35284254544678
                  },
                  {
                    first: 199.47,
                    second: 223.68284254544676
                  },
                  {
                    first: 199.454,
                    second: 223.68284254544676
                  },
                  {
                    first: 209.454,
                    second: 223.73284254544677
                  },
                  {
                    first: 219.454,
                    second: 223.5728425454468
                  },
                  {
                    first: 229.454,
                    second: 223.3228425454468
                  },
                  {
                    first: 239.454,
                    second: 223.3228425454468
                  },
                  {
                    first: 249.454,
                    second: 223.18284254544676
                  },
                  {
                    first: 259.454,
                    second: 222.56284254544676
                  },
                  {
                    first: 269.454,
                    second: 222.05284254544677
                  },
                  {
                    first: 279.454,
                    second: 221.0228425454468
                  },
                  {
                    first: 289.454,
                    second: 221.03284254544678
                  },
                  {
                    first: 299.454,
                    second: 220.41284254544678
                  },
                  {
                    first: 309.454,
                    second: 220.28284254544678
                  },
                  {
                    first: 319.454,
                    second: 219.80284254544677
                  },
                  {
                    first: 329.454,
                    second: 219.4028425454468
                  },
                  {
                    first: 339.454,
                    second: 218.5728425454468
                  },
                  {
                    first: 349.454,
                    second: 218.60284254544678
                  },
                  {
                    first: 356.094,
                    second: 219.03284254544678
                  }
                ]
              },
              {
                distance: 13.214,
                relativeDirection: "UTURN_RIGHT",
                streetName: "SW Ravensview Dr (path)",
                absoluteDirection: "WEST",
                stayOn: true,
                area: false,
                bogusName: false,
                lon: -122.7002374,
                lat: 45.5075393,
                elevation: [
                  {
                    first: 0,
                    second: 218.3928425454468
                  },
                  {
                    first: 4.69,
                    second: 217.8928425454468
                  }
                ]
              }
            ]
          }
        ],
        tooSloped: false
      }
    ]
  },
  debugOutput: {
    precalculationTime: 40,
    pathCalculationTime: 555,
    pathTimes: [134, 239, 182],
    renderingTime: 4,
    totalTime: 599,
    timedOut: false
  },
  elevationMetadata: {
    ellipsoidToGeoidDifference: -19.522842545446778,
    geoidElevation: true
  }
};
