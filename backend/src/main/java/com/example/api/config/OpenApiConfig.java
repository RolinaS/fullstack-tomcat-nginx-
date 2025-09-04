// backend/src/main/java/com/example/api/config/OpenApiConfig.java
package com.example.api.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;          
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.OpenAPI;                
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
  info = @Info(title = "Nutrition API", version = "v1",
               description = "CRUD Utilisateurs / Aliments / Recettes"),
  servers = { @Server(url = "/") }
)
@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI baseOpenAPI() {
    return new OpenAPI().info(new io.swagger.v3.oas.models.info.Info()
      .title("Nutrition API")
      .version("v1")
      .description("CRUD Utilisateurs / Aliments / Recettes"));
  }
}
