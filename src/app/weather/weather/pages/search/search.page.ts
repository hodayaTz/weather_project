import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { LocationService } from 'src/app/core/services/location.service';
import { WeatherService } from 'src/app/core/services/weather.service';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { Forecast } from 'src/app/shared/models/forecast.model';
import { Location } from 'src/app/shared/models/location.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage implements OnInit {

  favorites: Location[];
  searchText: any;
  locations$: Observable<Location[]>;
  currentWeather: CurrentWeather;
  srcImag: string = '';
  forecast: Forecast;
  srcIcons: string = '../../../assets/icons/weatherIcons/';
  location: Location;
  locationKey: string;
  durationInSeconds = 5;
  isMetric: boolean = true
  flag: boolean = true

  constructor(private _snackBar: MatSnackBar, private _activeRoute: ActivatedRoute, private _locationService: LocationService, private _weatherService: WeatherService, private _favoritesService: FavoritesService) { }

  ngOnInit() {
    this._activeRoute.paramMap.subscribe(data => {
      if (data.has("locationKey")) {
        this.locationKey = String(data.get("locationKey"))

        this._locationService.getLocationByKey(this.locationKey).subscribe(_location => {
          this.location = _location
          this.displayWeather(this.locationKey);
        }, err => alert('Something Wrong!!'));
      }

      else {
        this._locationService.getAutocompleteLocation('Tel-Aviv').subscribe(_locations => {
          this.location = _locations[0];
          this.locationKey = this.location.Key
          this.displayWeather(this.locationKey);
        }, err => alert('Something Wrong!!'));
      }
    }, err => alert('Something Wrong!!'))
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'ok', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'],
      duration: this.durationInSeconds * 1000
    });
  }


  autoCompleteLocation() {
    this.locations$ = this._locationService.getAutocompleteLocation(this.searchText)
    this.locations$.subscribe(loc => {
      if (loc == [])
        this.flag = false
      else this.flag = true
    },err=> alert('Something Wrong!!'))
  }

  displayFn(location: Location): string {
    return location && location.LocalizedName ? location.LocalizedName : '';
  }

  getSrcImage(srcNum) {
    return this.srcIcons + '' + srcNum + '.png';
  }

  displayWeather(value?: string) {
    let key
    if (value) key = value

    else {
      this.location = this.searchText;
      key = this.searchText.Key
    }
    this._weatherService.getCurrentWeather(key).subscribe(weather => {
      this.currentWeather = weather[0];
      this.srcImag = this.getSrcImage(this.currentWeather.WeatherIcon);
    }, err => alert('Something Wrong!!'))

    this._weatherService.getForecast(key).subscribe(f_Weather => {
      this.forecast = f_Weather;
    }, err => alert('Something Wrong!!'))
  }

  isValid(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (!/[a-zA-Z0-9]/.test(inp)) {
      event.preventDefault();
    }
  }

  Favorites() {
    let isFavorite = true
    this.favorites = this._favoritesService.getFavorites();
    this.favorites.forEach(f => { if (f.Key === this.location.Key) isFavorite = false })
    if (isFavorite) {
      this._favoritesService.addToFavorites(this.location);
      this.openSnackBar('Favorite city successfully added!!')
    }
    else {
      this._favoritesService.removeFromFavorites(this.location.Key);
      this.openSnackBar('Favorite city successfully removed!!')
    }
  }

  changeTemperatureUnit() {
    this._weatherService.isMetric = !this._weatherService.isMetric;
    this._weatherService.temperatureUnitChanged.next();

    this._weatherService.getForecast(this.locationKey).subscribe(f_Weather => {
      this.forecast = f_Weather;
    })
    this.isMetric = !this.isMetric
  }
}



