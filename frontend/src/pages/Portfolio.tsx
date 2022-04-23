import { gql, useQuery } from "@apollo/client";
import { useEffect } from 'react'
import { useBlockNumber, useEthers } from '@usedapp/core'
import { useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";

export const Portfolio = () => {

  const address = useParams().address ?? ''
  const { account } = useEthers()
  const blockNumber = useBlockNumber();
  const { data, loading, refetch } = useQuery(
    gql`
      query getVaultsById($id: String!) {
        vault(id: $id)  {
          id
          owner
          asset {
            id
          }
          name
          symbol
        }
      }
    `,
    { variables: { id: address.toLowerCase() } }
  );

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);

  console.log(data)
  return <div>
    {data?.vault?.name}
    <br/>
    {data?.vault?.id}
    <br/>
    Available protocols:
    <br/>
    <Button>
      AAVE
    </Button>
    <br/>
    <Button>
      APWine
    </Button>
    <br/>
    <Button>
      Yearn
    </Button>
  </div>
}

const ManageModal = () => {
  
}