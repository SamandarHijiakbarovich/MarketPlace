# ---- Build bosqichi (to'liq SDK bilan) ----
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Avval faqat .csproj fayllarni ko'chirib restore qilamiz (Docker cache tejaladi)
COPY MarketPlace.sln ./
COPY src/MarketPlace.Domain/*.csproj src/MarketPlace.Domain/
COPY src/MarketPlace.Application/*.csproj src/MarketPlace.Application/
COPY src/MarketPlace.Infrastructure/*.csproj src/MarketPlace.Infrastructure/
COPY src/MarketPlace.API/*.csproj src/MarketPlace.API/
RUN dotnet restore src/MarketPlace.API/MarketPlace.API.csproj

# Qolgan kodni ko'chirib, Release rejimida publish qilamiz
COPY . .
RUN dotnet publish src/MarketPlace.API/MarketPlace.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# ---- Runtime bosqichi (yengil aspnet image) ----
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_ENVIRONMENT=Production
# Render PORT env'ini o'zi beradi; lokal docker run uchun fallback 8080
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MarketPlace.API.dll"]
