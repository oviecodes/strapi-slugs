/*
 *
 * HomePage
 *
 */

import React, { Suspense, memo, useState, useEffect } from 'react';

import slugRequests from '../../api/slugs';

import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Typography } from '@strapi/design-system/Typography';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';
import { BaseHeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Checkbox } from '@strapi/design-system/Checkbox';
import { BaseCheckbox } from '@strapi/design-system/BaseCheckbox';
import { Radio, RadioGroup } from '@strapi/design-system/Radio';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Button } from '@strapi/design-system/Button';
import { Icon } from '@strapi/design-system/Icon';
import { LoadingIndicatorPage, CheckPagePermissions, useGuidedTour, useAutoReloadOverlayBlocker } from '@strapi/helper-plugin';

import { Illo } from '../../components/Illo';

const HomePage: React.VoidFunctionComponent = () => {
  
  // let data

  const [contentTypeCount, setContentTypeCount] = useState(0);
  const [ contentTypes, setContentTypes ] = useState(Array<any>)
  // const [settings, setSettings] = useState({disabled:false})
  const [ disable, setDisabled ] = useState(false)
  const [ entries, setEntry ] = useState(contentTypes)
  // const [ option, setOption ] = useState([])
  const [ loading, setLoading ] = useState(false)

  console.log(entries, 'all array')

  const ROW_COUNT = 6;
  const COL_COUNT = 10;

  // const { lockAppWithAutoreload, unlockAppWithAutoreload } = useAutoReloadOverlayBlocker();

  useEffect(() => {
    fetchData()
  }, [setContentTypeCount]);

  function fetchData() {
    slugRequests.getContentTypes().then((res: any) => {
      setContentTypeCount(res.data.length);
      res.data.map((e: any) => {
        e.slugEnabled = !!e.pluginOptions.slug
        e.slugField = e.pluginOptions?.slug?.field
        e.savable = false
      })
      setContentTypes(res.data)
      setEntry(res.data)
    });
  };

  return (
    <>
        <BaseHeaderLayout
          title="Slugify Plugin"
          subtitle="Click checkbox to allow slugs on Content Type"
          as="h2"
        />

        <ContentLayout>
          {loading == true && (
            <LoadingIndicatorPage />)
          }
          {contentTypeCount === 0 && !loading && (
            <EmptyStateLayout icon={<Illo />} content="You don't have any Content Types yet..." />
          )}
          {contentTypeCount > 0 && !loading && (
            <Box background="neutral0" hasRadius={true} shadow="filterShadow">
              <Flex justifyContent="space-between" padding={5}>
                <Typography variant="alpha">You have a total of {contentTypeCount} contentTypes 🚀</Typography>

                {/* <Button onClick={
                  () => {
                    slugRequests.setSlugs(entries)
                    // window.location.reload();
                  }
                } startIcon={<Icon/>}>Save</Button>
                */}
              </Flex>
              {/* <Checkbox checked={disable} onClick={() => setDisabled(!disable)} >hello</Checkbox>
              <input type='checkbox'></input> */}
              
              <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
                <Thead>
                  <Tr>
                    <Th>
                      <BaseCheckbox checked={disable} onClick={() => setDisabled(!disable)} aria-label="Select all entries" />
                    </Th>
                    <Th>
                      <Typography variant="sigma">S/N</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Collection Name</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">UID</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Categories</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Action</Typography>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contentTypes.map((entry: any, i: number) => <Tr key={entry.collectionName}>
                      <Td>
                        <BaseCheckbox checked={entry.slugEnabled} key={i} onClick={(e:any) => {
                          // e.preventDefault()
                          entry.slugEnabled = !entry.slugEnabled

                          console.log('before', entry.savable)

                          entry.savable = !entry.savable

                          console.log('after', entry.savable)

                          setEntry((arr): any => {
                            // console.log(arr, 'all array')
                            return arr.map((el) => {
                              if(el.collectionName == entry.collectionName) {
                                // console.log('updating', el.slugEnabled)
                                return { ...el, slugEnabled: entry.slugEnabled }
                              }
                              else {
                                // console.log('not updating', el.slugEnabled)
                                return { ...el, slugEnabled: el.slugEnabled }
                              }
                            })
                          })
                          // console.log(entry)
                        }} />
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{i+1}</Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{entry.collectionName}</Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{entry.uid}</Typography>
                      </Td>
                      <Td> 
                        <Flex>
                          <RadioGroup labelledBy={`contentType-${i}`} onChange={(e: any) => {
                              console.log(e.target.value, entry.slugField)

                              entry.slugField = e.target.value

                              if(entry.slugEnabled) {
                                entry.savable = true
                              }

                              // entry.savable = !entry.savable

                              e.stopPropagation()
                              setEntry((arr): any => {
                                return arr.map((el) => {
                                  if(el.collectionName == entry.collectionName) {
                                    return { ...el, slugField: e.target.value }
                                  }
                                  else {
                                    return { ...el, slugField: el.slugField }
                                  }
                                })
                              })
                            }} name={`contentType-${i}`}>
                            {
                              Object.keys(entry.attributes).map((attr: any, e: number) => {
                                if(entry.attributes[attr].type == 'string' && attr !== 'slug' ) return <Radio padding={3} key={e} checked={ entry.slugField == attr } value={attr}>{attr}</Radio>
                            })
                            }
                          </RadioGroup>
                        </Flex>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">
                          <Button disabled={ !entry.savable } key={i} onClick={
                            async () => {
                              if(entry.slugEnabled && !entry.slugField) return
                              slugRequests.setSlugs(entry)
                              // window.location.reload();
                              // lockAppWithAutoreload();

                              setLoading(true)

                              // Make sure the server has restarted
                              await slugRequests.serverRestartWatcher(true);

                              setLoading(false)

                              fetchData()

                              // Unlock the app
                              // await unlockAppWithAutoreload();
                            }
                          } startIcon={<Icon/>}>
                            Save
                          </Button>
                        </Typography>
                      </Td>
                    </Tr>)}
                </Tbody>
              </Table>

            </Box>
          )}
        </ContentLayout>
    </>
  );
};

export default memo(HomePage);

// export default HomePage;
