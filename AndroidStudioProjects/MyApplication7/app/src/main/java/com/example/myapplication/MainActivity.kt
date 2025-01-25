package com.example.myapplication

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import retrofit2.*
import retrofit2.converter.gson.GsonConverterFactory
import kotlin.math.sqrt
import android.content.Intent
import com.example.myapplication.R
import com.example.projekt_android.CurrencyApi
import com.example.projekt_android.CurrencyRate
import com.example.projekt_android.CurrencyTable

class MainActivity : AppCompatActivity(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    private var shakeThreshold = 15f

    private lateinit var currencyApi: CurrencyApi
    private var currencyRates: List<CurrencyRate>? = null
    private lateinit var fromSpinner: Spinner
    private lateinit var toSpinner: Spinner
    private lateinit var amountInput: EditText
    private lateinit var resultView: TextView
    private lateinit var capitalSpinner: Spinner
    private lateinit var goToMapButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        try {
            // Inicjalizacja widoków
            fromSpinner = findViewById(R.id.fromSpinner)
            toSpinner = findViewById(R.id.toSpinner)
            amountInput = findViewById(R.id.amountInput)
            resultView = findViewById(R.id.resultView)
            capitalSpinner = findViewById(R.id.capitalSpinner)
            goToMapButton = findViewById(R.id.goToMapButton)

            setupCapitalSpinner()

            goToMapButton.setOnClickListener {
                val selectedCapital = capitalSpinner.selectedItem?.toString()
                if (selectedCapital.isNullOrEmpty()) {
                    Toast.makeText(this, "Wybierz stolicę", Toast.LENGTH_SHORT).show()
                } else {
                    val intent = Intent(this, MapsActivity::class.java)
                    intent.putExtra("capital", selectedCapital)
                    startActivity(intent)
                }
            }

            // Inicjalizacja akcelerometru
            sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
            accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

            // Konfiguracja Retrofit
            val retrofit = Retrofit.Builder()
                .baseUrl("https://api.nbp.pl/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build()
            currencyApi = retrofit.create(CurrencyApi::class.java)

            fetchExchangeRates()

            findViewById<Button>(R.id.convertButton).setOnClickListener {
                convertCurrency()
            }

        } catch (e: Exception) {
            Log.e("MainActivity", "Błąd podczas inicjalizacji: ${e.message}", e)
        }
    }

    private fun setupCapitalSpinner() {
        val capitalCities = listOf(
            "Berlin", "Washington", "Brussels", "Warsaw",  "London", "Paris", "Tokyo", "Madrid", "Rome"
        )

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, capitalCities)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        capitalSpinner.adapter = adapter
    }

    private fun fetchExchangeRates() {
        currencyApi.getExchangeRates().enqueue(object : Callback<List<CurrencyTable>> {
            override fun onResponse(call: Call<List<CurrencyTable>>, response: Response<List<CurrencyTable>>) {
                if (response.isSuccessful) {
                    val ratesTable = response.body()?.getOrNull(0)?.rates
                    if (ratesTable.isNullOrEmpty()) {
                        Toast.makeText(this@MainActivity, "Nie znaleziono kursów walut", Toast.LENGTH_SHORT).show()
                        return
                    }

                    currencyRates = ratesTable
                    val currencies = ratesTable.map { it.code }
                    val adapter = ArrayAdapter(this@MainActivity, android.R.layout.simple_spinner_item, currencies)
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                    fromSpinner.adapter = adapter
                    toSpinner.adapter = adapter
                } else {
                    Toast.makeText(this@MainActivity, "Błąd pobierania danych z serwera", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<CurrencyTable>>, t: Throwable) {
                Toast.makeText(this@MainActivity, "Błąd połączenia: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun convertCurrency() {
        val fromCurrency = fromSpinner.selectedItem?.toString()
        val toCurrency = toSpinner.selectedItem?.toString()
        val amount = amountInput.text.toString().toDoubleOrNull()

        if (amount == null) {
            Toast.makeText(this, "Wprowadź poprawną kwotę", Toast.LENGTH_SHORT).show()
            return
        }

        if (currencyRates == null) {
            Toast.makeText(this, "Kursy walut nie zostały jeszcze załadowane", Toast.LENGTH_SHORT).show()
            return
        }

        val fromRate = currencyRates!!.find { it.code == fromCurrency }?.mid
        val toRate = currencyRates!!.find { it.code == toCurrency }?.mid

        if (fromRate != null && toRate != null) {
            val result = (amount / fromRate) * toRate
            resultView.text = "Wynik: %.2f".format(result)
        } else {
            Toast.makeText(this, "Nie znaleziono kursu waluty", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onResume() {
        super.onResume()
        accelerometer?.also { sensor ->
            sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_UI)
        }
    }

    override fun onPause() {
        super.onPause()
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null || !this::amountInput.isInitialized || !this::resultView.isInitialized) return

        val x = event.values[0]
        val y = event.values[1]
        val z = event.values[2]

        val acceleration = sqrt((x * x + y * y + z * z).toDouble()).toFloat()
        if (acceleration > shakeThreshold) {
            amountInput.text?.clear()
            resultView.text = ""
            Toast.makeText(this, "Reset danych!", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}