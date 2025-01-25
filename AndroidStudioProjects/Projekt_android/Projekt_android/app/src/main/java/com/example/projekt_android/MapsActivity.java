package com.example.projekt_android;

import androidx.fragment.app.FragmentActivity;
import android.os.Bundle;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);  // Używamy layoutu dla MapsActivity

        // Inicjalizacja mapy i nasłuchowanie na jej gotowość
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map); // Upewnij się, że masz ten ID w layout'cie
        mapFragment.getMapAsync(this);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        // Sprawdź, czy dane zostały przekazane
        String capitalCity = getIntent().getStringExtra("capital");

        if (capitalCity != null) {
            LatLng location = getCapitalCoordinates(capitalCity);
            if (location != null) {
                mMap.addMarker(new MarkerOptions().position(location).title("Stolica"));
                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(location, 12));
            } else {
                Toast.makeText(this, "Nieznana lokalizacja", Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(this, "Nieznaleziono danych o stolicy", Toast.LENGTH_SHORT).show();
        }
    }

    // Metoda do uzyskiwania współrzędnych dla stolic
    private LatLng getCapitalCoordinates(String capital) {
        switch (capital) {
            case "Washington":
                return new LatLng(38.8954, -77.0365); // Washington, USA
            case "Brussels":
                return new LatLng(50.8503, 4.3517); // Bruksela, Belgia
            case "Warsaw":
                return new LatLng(52.2297, 21.0122); // Warszawa, Polska
            default:
                return null;
        }
    }
}
