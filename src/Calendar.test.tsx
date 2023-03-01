import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Calendar from './Calendar';
import dayjs from "dayjs";


describe('Calendar component', () => {
    beforeEach(() => {

        const birthdayData = {
            births: [{ text: 'John Doe' }, { text: 'Jane Doe' }],
        };
        
        global.fetch = jest.fn().mockResolvedValue({
              json: jest.fn().mockResolvedValue({
                  birthdayData,
              }),
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should show the Calendar title', async () => {

        const { getByText } = render(<Calendar />);
        await waitFor(() => {
                const element = getByText('Birthday Calendar');
                expect(element).toBeInTheDocument();
        });
    });

        
    // it ('should display the calendar with current date selected when first rendered', async () => {

    //     const { getByText } = render(<Calendar />);
    //     await waitFor(() => {
    //             const year = dayjs().year().toString();

    //             const element = getByText(year);
    //             expect(element).toBeInTheDocument();
    //     });
    // });

    // it('should display a list of famous birthdays when a date is selected', async () => {

    //     const { getByTestId, getByText} = render(<Calendar />);
    //     await waitFor(() => {

    //             const element = getByTestId('calendar-input');
    //             expect(element).toBeInTheDocument();

    //             fireEvent.change(element, { target: { value: '2022-02-22' } });

    //             expect(getByText('Famous birthdays on this date:')).toBeInTheDocument();
    //             expect(screen.getByText('John Doe')).toBeInTheDocument();
    //             expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    //     });
    // });


    // it('should add and remove favourite birthdays when star icon is clicked', async () => {

    //      render(<Calendar />);
    //     fireEvent.change(screen.getByLabelText('Pick a date'), { target: { value: '2022-02-22' } });
    //     await waitFor(() => screen.getByText('Famous birthdays on this date:'));

    //     const johnDoeStar = screen.getAllByLabelText('Favorite icon')[0];
    //     fireEvent.click(johnDoeStar);
    //     expect(screen.getByText('Favourite Birthdays:')).toBeInTheDocument();
    //     expect(screen.getByText('John Doe')).toBeInTheDocument();

    //     const janeDoeStar = screen.getAllByLabelText('Favorite icon')[1];
    //     fireEvent.click(janeDoeStar);
    //     expect(screen.getByText('Jane Doe')).toBeInTheDocument();

    // });


});   
