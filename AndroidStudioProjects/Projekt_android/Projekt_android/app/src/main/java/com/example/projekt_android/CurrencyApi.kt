package com.example.projekt_android

import retrofit2.Call
import retrofit2.http.GET

// Interfejs API dla pobierania danych
interface CurrencyApi {
    @GET("exchangerates/tables/A/")
    fun getExchangeRates(): Call<List<CurrencyTable>>
}

// Model danych - tabela walut
data class CurrencyTable(
    val rates: List<CurrencyRate>
)

// Model danych - kurs waluty
data class CurrencyRate(
    val currency: String,
    val code: String,
    val mid: Double
)
