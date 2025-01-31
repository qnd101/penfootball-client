import prodconfig from "config.json"
import devconfig from "config_dev.json"

let config;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  config = devconfig
} else {
  config = prodconfig
}
export default config;