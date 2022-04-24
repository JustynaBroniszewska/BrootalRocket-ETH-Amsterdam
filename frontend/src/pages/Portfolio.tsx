import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from 'react'
import { useBlockNumber, useContractFunction, useEthers } from '@usedapp/core'
import { useParams } from "react-router-dom";
import { Button, VStack, Box, FormControl, FormLabel, Select, useTabList, Input } from "@chakra-ui/react";
import { Contract, utils } from 'ethers'
import { ASSETS } from "./Create";
import axios from 'axios'

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

  const [description, setDescription] = useState("");
  useEffect(() => {
    const getDescription = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/portfolio/${account}/${data?.vault?.name}`
        );
        setDescription(res.data.description);
      } catch {}
    };
    getDescription();
  }, [account, data?.vault?.name]);

  return <div>
    {data?.vault?.name}
    <br />
    {data?.vault?.id}      
    <br />
      {description}
    <ManageModal portfolioAddress={data?.vault?.id} />
  </div>
}


const ManageModal = ({ portfolioAddress }: { portfolioAddress: string }) => {
  const [state, setState] = useState('default')
  if (state == 'aave') {
    return (<ManageAave portfolioAddress={portfolioAddress} />)
  }

  return (<VStack>
    <Box>
      Available protocols:
    </Box>
    <br />
    <Button onClick={() => setState('aave')}>
      AAVE
    </Button>
    <br />
    <Button>
      APWine
    </Button>
    <br />
    <Button>
      Yearn
    </Button></VStack>)
}

const SUPPORTED_AAVE_OPERATIONS = ['deposit', 'borrow', 'withdraw']

const AAVE = '0x794a61358D6845594F94dc1DB02A252b5b4814aD'

const ManageAave = ({ portfolioAddress }: { portfolioAddress: string }) => {
  const contract = new Contract(AAVE, new utils.Interface(['function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) public']))
  const { send, state } = useContractFunction(contract, 'supply')
  console.log(state)
  return (<VStack
    as="form"
    maxW="sm"
    mt="4"
    onSubmit={async (e) => {
      e.preventDefault();
      const target = e.target as any;
      console.log('send?', target.amount.value, utils.parseEther(target.amount.value.toString()))
      await send(ASSETS[0].address, utils.parseEther(target.amount.value.toString()), portfolioAddress, '')

    }}>
    <FormControl>
      <FormLabel htmlFor="network">Network:</FormLabel>
      <Select id="operation">
        {SUPPORTED_AAVE_OPERATIONS.map((operation) => (
          <option value={operation}>{operation}</option>
        ))}
      </Select>
      <FormControl>
        <FormLabel htmlFor="amount">Amount:</FormLabel>
        <Input id="amount" placeholder="Amount"></Input>
      </FormControl>
    </FormControl>
    <Button type="submit" w="32">
      Send
    </Button>
  </VStack>)
}