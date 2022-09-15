module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/docs-list/" : "/",
  transpileDependencies: [
    'vuetify'
  ]
}