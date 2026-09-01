terraform {
  required_version = ">= 1.0.0"
  required_providers {
    newrelic = {
      source  = "newrelic/newrelic"
      version = "~> 3.0"
    }
  }
}

variable "new_relic_account_id" {
  type = string
}

variable "new_relic_api_key" {
  type = string
}

provider "newrelic" {
  account_id = var.new_relic_account_id
  api_key    = var.new_relic_api_key
  region     = "US" # Change to "EU" if using European New Relic datacenter
}
