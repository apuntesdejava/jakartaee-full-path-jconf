package com.mycompany.projecttracker.adapter.in.health;

import jakarta.enterprise.context.ApplicationScoped;

import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.Connection;

@ApplicationScoped
public class DatabaseAvailability {

    public DatabaseStatus check() {
        try (Connection conn = dataSource().getConnection()) {
            if (conn.isValid(2)) {
                return DatabaseStatus.available();
            }

            return DatabaseStatus.unavailable("Conexion invalida");
        } catch (Exception e) {
            return DatabaseStatus.unavailable(e.getMessage());
        }
    }

    private DataSource dataSource() throws Exception {
        return (DataSource) new InitialContext().lookup("jdbc/projectTracker");
    }

    public record DatabaseStatus(boolean up, String error) {

        public static DatabaseStatus available() {
            return new DatabaseStatus(true, null);
        }

        public static DatabaseStatus unavailable(String error) {
            return new DatabaseStatus(false, error);
        }
    }
}
