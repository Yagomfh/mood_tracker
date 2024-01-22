import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import "./App.css";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [user, setUser] = useState(1); // TODO: get this from auth0
  const [input, setInput] = useState("");
  const [level, setLevel] = useState(1);

  const moods = useQuery({
    queryKey: ["moods"],
    queryFn: () => axios.get(baseURL + "/api/moods"),
  });

  const mutation = useMutation({
    mutationFn: (newMood: {
      level: number;
      note: string;
      date: Date;
      user: number;
    }) => {
      const mood = axios.post(baseURL + "/api/moods", { data: newMood });
      moods.refetch();
      return mood;
    },
  });

  return (
    <VStack>
      <Tabs>
        <TabList>
          <Tab>All</Tab>
          <Tab>Create</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {moods.isFetching && <Text>Loading...</Text>}
            {moods.isError && (
              <Text>There was an error loading your moods.</Text>
            )}
            <VStack gap={10}>
              {moods.data?.data.data.map((mood: any) => (
                <Card>
                  <CardHeader>
                    <Heading size="md">{mood.attributes.date}</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing="4">
                      <Box>
                        <Heading size="xs" textTransform="uppercase">
                          {mood.attributes.level} / 5
                        </Heading>
                        <Text pt="2" fontSize="sm">
                          {mood.attributes.note}
                        </Text>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack gap={10}>
              {mutation.isPending && <Text>Saving your mood...</Text>}
              <Slider
                defaultValue={4}
                min={0}
                max={5}
                step={1}
                value={level}
                onChange={(value) => setLevel(value)}
              >
                <SliderTrack bg="red.100">
                  <SliderFilledTrack bg="tomato" />
                </SliderTrack>
                <SliderMark value={0}>0</SliderMark>
                <SliderMark value={1}>1</SliderMark>
                <SliderMark value={2}>2</SliderMark>
                <SliderMark value={3}>3</SliderMark>
                <SliderMark value={4}>4</SliderMark>
                <SliderMark value={5}>5</SliderMark>
                <SliderThumb boxSize={6} />
              </Slider>
              <Textarea
                placeholder="Here is a sample placeholder"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                colorScheme="blue"
                onClick={() =>
                  mutation.mutate({
                    level,
                    note: input,
                    date: new Date(),
                    user,
                  })
                }
              >
                Save
              </Button>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}

export default App;
