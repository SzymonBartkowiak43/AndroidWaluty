package com.example.myapplication;

import androidx.fragment.app.FragmentActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.Spinner;
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
        setContentView(R.layout.activity_maps);


        ImageButton backButton = findViewById(R.id.backButton);

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        String selectedCapital = getIntent().getStringExtra("capital");
        if (selectedCapital != null) {
            LatLng location = getCapitalCoordinates(selectedCapital);
            if (location != null) {
                mMap.clear();
                mMap.addMarker(new MarkerOptions().position(location).title(selectedCapital));
                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(location, 12));
            } else {
                Toast.makeText(this, "Nieznana lokalizacja", Toast.LENGTH_SHORT).show();
            }
        }
    }


    private LatLng getCapitalCoordinates(String capital) {
        switch (capital) {
            case "Washington":
                return new LatLng(38.8954, -77.0365);
            case "Berlin":
                return new LatLng(52.5200, 13.4050);
            case "Brussels":
                return new LatLng(50.8503, 4.3517);
            case "Warsaw":
                return new LatLng(52.2297, 21.0122);
            case "London":
                return new LatLng(51.5074, -0.1278);
            case "Paris":
                return new LatLng(48.8566, 2.3522);
            case "Tokyo":
                return new LatLng(35.6895, 139.6917);
            default:
                return null;
        }
    }
}