import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LotteryResultsBody, TicketBody, TypedNumbers } from '../models/models';

let ticket = <TicketBody>{};
let lotteryResults = <LotteryResultsBody>{};

export const useApi = () => {
  const navigate = useNavigate();
  const [postRequestError, setPostRequestError] = useState(false);
  const [getRequestError, setGetRequestError] = useState(false);

  const sendNumbers = async (numbers: TypedNumbers) => {
    try {
      const response = await axios.post('/api/inputNumbers', numbers);
      ticket = response.data;
      navigate('/ticket');
    } catch (error) {
      if (error) setPostRequestError(true);
      else setPostRequestError(false);
    }
  };

  const getResults = async (ticketId: string) => {
    try {
      const response = await axios.get(`/api/results/${ticketId}`);
      lotteryResults = response.data;
      navigate('/checkResults/results');
    } catch (error) {
      if (error) setGetRequestError(true);
      else setGetRequestError(false);
    }
  };
  return {
    sendNumbers,
    getResults,
    postRequestError,
    getRequestError,
    ticket,
    lotteryResults,
  };
};
