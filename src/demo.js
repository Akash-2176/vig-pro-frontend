const StationSchema = new mongoose.Schema({
    stationId: { type: String, required: true },
    stationDistrict: { type: String, required: true },
    stationLocation: { type: String, required: true },
    motherVillage: { type: String, required: true },
    stationIdol: [
      {
        idol_id: { type: String, required: true },
        motherVillage: { type: String, required: true },
        hamletVillage: { type: String },
        placeOfInstallation: { type: String, required: true },
        placeOfImmersion: { type: String, required: true },
        setupDate: { type: Date },
        immersionDate: { type: Date },
        typeOfInstaller: { type: String },
        licence: { type: String },
        height: { type: Number },
         permission: {
           police: { type: Boolean, default: false },
           fireService: { type: Boolean, default: false },
           TNEB: { type: Boolean, default: false },
         },
         facility: {
           electricalEquipment: { type: Boolean, default: false },
           lightingFacility: { type: Boolean, default: false },
           CCTVFacility: { type: Boolean, default: false },
         },
         property: {
           type: { type: String },
           description: { type: String },
         },
         shed: {
           type: { type: String },
           description: { type: String },
         },
         volunteers: [
           {
             name: { type: String },
             mobileNo: { type: String },
             address: { type: String },
           },
         ],
         modeOfTransport: {
          vehicleType: { type: String },
          people: { type: Number },
        },
        route: [{ type: String }],
        immersionSafety: {
          barricade: { type: Boolean, default: false },
          lighting: { type: Boolean, default: false },
          safetyByFireService: { type: Boolean, default: false },
          PASystem: { type: Boolean, default: false },
        },
      },
    ],
    password: { type: String, required: true },
    dspId: { type: mongoose.Schema.Types.ObjectId, ref: "DSP" }, // Reference to DSP
  });