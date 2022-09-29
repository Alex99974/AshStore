import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { Box, Heading, Text, Image, Card, Button } from "gestalt";
const apiUrl = process.env.API_URL || "http://ashwiki.ru:1337";
const strapi = new Strapi(apiUrl);

class Brews extends React.Component {
  state = {
    brews: [],
    brand: ""
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
          brand(id: "${this.props.match.params.brandId}") {
            data{
              id
              attributes{
              name
              description
                image{
                  data{
                    attributes{
                      url
                    }
                  }
                }
                brews {
                  data{
                    id
                    attributes{
                      name
                      description
                      image{
                        data{
                          attributes{
                            url
                          }
                        }
                      }
                      price
                      brand{
                        data{
                          id
                        }
                      }
                      createdAt
                      updatedAt
                    }
                  }
                }
              }
            }        
          }
        }`
        }
      });

      this.setState({
        brews: response.data.brand.data.attributes.brews.data,
        brand: response.data.brand.data.name
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { brand, brews } = this.state;

    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="start"
      >
        {/* Brews Section */}
        <Box display="flex" direction="column" alignItems="center">
          {/* Brews Heading */}
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>
          {/* Brews */}
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#bdcdd9"
              }
            }}
            wrap
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}
          >
            {brews.map(brew => (
              <Box paddingY={4} margin={2} width={210} key={brew.id}>
                <Card
                  image={
                    <Box height={250} width={200}>
                      <Image
                        fit="cover"
                        alt="Brand"
                        naturalHeight={1}
                        naturalWidth={1}
                        src={`${apiUrl}${brew.attributes.image.data.attributes.url}`}
                      />
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                  >
                    <Box marginBottom={2}>
                      <Text bold size="xl">
                        {brew.attributes.name}
                      </Text>
                    </Box>
                    <Text>{brew.attributes.description}</Text>
                    <Text color="orchid">${brew.attributes.price}</Text>
                    <Box marginTop={2}>
                      <Text bold size="xl">
                        <Button color="blue" text="Add to Cart" />
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default Brews;