module.exports = {
  // milisecond / second
  _1_MINUTES: 60 * 1000,
  _5_MINUTES: 5 * 60 * 1000,
  _1_DAY: 24 * 60 * 60 * 1000,
  _1_DAY_S: 24 * 60 * 60,
  _1_HOURS_S: 60 * 60,
  _1_YEAR: 365 * 24 * 60 * 60 * 1000,

  _DEFAULT_CACHE_TIME: 15,

  //Delete Flag
  DELETED_ENABLE: true,
  DELETED_DISABLE: false,

  // Bcrypt setting
  SALT_ROUNDS: 10,

  //Cloud
  S3_BUCKET_DOCUMENTS: "document",
  S3_BUCKET_VIDEOS: "video",
  S3_BUCKET_IMAGES: "image",
  S3_BUCKET_AUDIO: "audio",
  S3_BUCKET_DATA: "data",
};
