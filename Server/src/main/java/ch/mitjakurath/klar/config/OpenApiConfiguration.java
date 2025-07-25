package ch.mitjakurath.klar.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Klar API @ Mitja Kurath", version = "0.1.0"))
public class OpenApiConfiguration {
}
