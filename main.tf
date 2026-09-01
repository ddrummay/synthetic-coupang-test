# Tell Terraform to import the existing monitor into state instead of creating a duplicate
import {
  to = newrelic_synthetics_script_monitor.coupang_monitor
  id = "533c412f-6530-498f-8d32-1872c8583cc1"
}

# 1. Scripted Browser Monitor
resource "newrelic_synthetics_script_monitor" "coupang_monitor" {
  status           = "ENABLED"
  name             = "Coupang Workflow Check v2"
  type             = "SCRIPT_BROWSER"
  period           = "EVERY_15_MINUTES"
  locations_public = ["AP_NORTHEAST_2"]

  runtime_type         = "CHROME_BROWSER"
  runtime_type_version = "LATEST"
  script_language      = "JAVASCRIPT"

  script = file("${path.module}/monitors/coupang_check.js")
}

# 2. Alert Policy
resource "newrelic_alert_policy" "synthetic_policy" {
  name                = "Coupang Synthetic Alerts"
  incident_preference = "PER_CONDITION"
}

# 3. Alert Condition
resource "newrelic_nrql_alert_condition" "synthetic_failure_condition" {
  policy_id                    = newrelic_alert_policy.synthetic_policy.id
  type                         = "static"
  name                         = "Synthetic Failure: Coupang Workflow Interrupted"
  enabled                      = true
  violation_time_limit_seconds = 3600

  nrql {
    query = "SELECT count(*) FROM SyntheticCheck WHERE monitorId = '${newrelic_synthetics_script_monitor.coupang_monitor.id}' AND result = 'FAILED'"
  }

  critical {
    operator              = "above"
    threshold             = 0
    threshold_duration    = 60
    threshold_occurrences = "at_least_once"
  }
}
