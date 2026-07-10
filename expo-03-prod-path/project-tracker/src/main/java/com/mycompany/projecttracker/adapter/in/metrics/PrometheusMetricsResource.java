package com.mycompany.projecttracker.adapter.in.metrics;

import com.mycompany.projecttracker.adapter.in.health.DatabaseAvailability;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

@Path("/observability/metrics")
public class PrometheusMetricsResource {

    @Inject
    private HttpMetricsRegistry registry;

    @Inject
    private DatabaseAvailability databaseAvailability;

    @GET
    @PermitAll
    @Produces("text/plain; version=0.0.4; charset=utf-8")
    public String metrics() {
        return registry.toPrometheus(databaseAvailability.check().up());
    }
}
