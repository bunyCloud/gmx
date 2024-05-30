import { useState } from "react";
import { Button } from "@chakra-ui/react";


const CreateOrder = () => {
    const [transactionHash, setTransactionHash] = useState('');
 
 
    async function triggerCreateOrder() {
        try {
          const response = await fetch('http://localhost:2021/createOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          console.log('Transaction Hash:', data.txHash);
        } catch (error) {
          console.error('Error:', error);
        }
      }
      

return (
    <div>
      <Button onClick={triggerCreateOrder}>Create Order</Button>
      {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
    </div>
  );
};

export default CreateOrder;