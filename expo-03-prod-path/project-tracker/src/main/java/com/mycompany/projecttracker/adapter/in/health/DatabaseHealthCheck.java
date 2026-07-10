package com.mycompany.projecttracker.adapter.in.health;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Readiness;

@Readiness
@ApplicationScoped
public class DatabaseHealthCheck implements HealthCheck {

    public static final String DATABASE_CONNECTION = "Database Connection";

    @Inject
    private DatabaseAvailability databaseAvailability;

    @Override
    public HealthCheckResponse call() {
        DatabaseAvailability.DatabaseStatus status = databaseAvailability.check();

        if (status.up()) {
            return HealthCheckResponse.named(DATABASE_CONNECTION).up().withData("database", "MySQL at Docker").build();
        }

        return HealthCheckResponse.named(DATABASE_CONNECTION).down().withData("error", status.error()).build();
    }
}
