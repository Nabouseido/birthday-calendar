import React, { useState } from "react";
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
library.add(solidStar, regularStar);


interface Birthday {
  name: string;
  date: string;
  isFavourite: boolean;
}


function Calendar() {

    const [value, setValue] = useState(dayjs());
    const [birthdays, setBirthdays] = useState<Birthday[]>([]);

    const [favourites, setFavourites] = useState<string[]>([]);

    const handleFavouriteToggle = (personName: string) => {
        if (favourites.includes(personName)) {
            setFavourites(favourites.filter(name => name !== personName));
        } else {
            setFavourites([...favourites, personName]);
        }
    };

 
    function handleDateChange(date: dayjs.Dayjs): void {

        const month = date.month() + 1; //month index starts at 0
        const day = date.date();
        
        //retrieve a list of birthdays from this API then add the "text" field to an array
        fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`)
          .then((response) =>  response.json())
          .then((data) => {
            const birthdays = data.births.map((person: any) => {
                return {
                  name: person.text
                };
              });
            setBirthdays(birthdays);

          })
          .catch((error) => {
            console.error(error);
          });
    }

    function getIcon(name: string) {
        if (favourites.includes(name)){
            return solidStar;
        }
        else return regularStar;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                value={value}
                onChange={(newValue: any ) => {
                    setValue(newValue);
                    handleDateChange(newValue);
                }}
                renderInput={(params: JSX.IntrinsicAttributes) => <TextField {...params} />}
            />

            <div>

                {birthdays.length > 0 &&
                <div>
                    <ul className="fa-ul">
                        {birthdays.map((birthday, index) => (
                        <li key={index}>
                            <span className="fa-li">
                            <FontAwesomeIcon icon={getIcon(birthday.name)} onClick={() => handleFavouriteToggle(birthday.name)}/>
                            </span>
                            {birthday.name}
                        </li>
                        ))}
                    </ul>
                </div>
                }
            </div>
            
        </LocalizationProvider>
            
        
    );
}

export default Calendar;
