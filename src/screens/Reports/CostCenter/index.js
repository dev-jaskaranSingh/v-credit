import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import {
  useAllTransactions,
  useCompanyCostCenterData,
  useCustomersData,
} from '../../../apis/useApi';
import { useAuth } from '../../../hooks';
import navigation from '../../../navigations';
import { TwoCards } from '../../Components/TwoCards';
import DropDownFlashList from '../../Components/dropDownFlashList';
import { useAuthCompanyStore } from '../../../core/utils';

const renderHeader = () => (
  <View className={'flex-row justify-between px-4 py-2 space-x-2 items-center'}>
    <View className='flex-1 border-b-2 border-slate-300 w-1/3'>
      <Text variant={'bodyMedium'} className='text-left text-slate-800'>
        Customer
      </Text>
    </View>
    <View className='flex-1 border-b-2 border-amber-400'>
      <Text variant={'bodyMedium'} className='text-right text-slate-800 mr-2'>
        Given
      </Text>
    </View>
    <View className='flex-1 border-b-2 border-blue-500'>
      <Text variant={'bodyMedium'} className='text-right text-slate-800'>
        Received
      </Text>
    </View>
  </View>
);

const renderItem = ({ item }) => (
  <TouchableOpacity
    className={
      'flex flex-row justify-between items-center px-1.5 py-2 border-b-2 border-slate-200'
    }
    onPress={() =>
      navigation.navigate('CustomerTransactionDetails', {
        id: item?.customer_id,
        name: item?.name,
      })
    }
  >
    <View className='flex flex-row items-center w-1/4'>
      <View className='mr-1'>
        {item?.transaction_type_id === 2 ? (
          <MaterialCommunityIcons
            name='call-received'
            size={14}
            color='green'
          />
        ) : (
          <MaterialIcons name='call-made' size={14} color='red' />
        )}
      </View>
      <View>
        <Text variant={'titleSmall'} className='text-slate-800'>
          {item?.customer?.name}
        </Text>
        <Text variant={'labelSmall'} className='text-slate-400'>
          {item?.date}
        </Text>
      </View>
    </View>
    <View>
      {item?.transaction_type_id === 1 ? (
        <View className={'mr-2'}>
          <Text variant={'bodyMedium'} className='text-slate-800 mr-2'>
            {item?.amount}
          </Text>
          <Text variant={'labelSmall'} className='text-slate-400 mr-2'>
            (Udhaar)
          </Text>
        </View>
      ) : (
        <Text variant={'bodyMedium'} className={'text-slate-400 text-center'}>
          {' '}
          -{' '}
        </Text>
      )}
    </View>
    <View className={'flex flex-row items-right'}>
      <View>
        {item?.transaction_type_id === 2 ? (
          <View>
            <Text variant={'bodyMedium'} className='text-slate-800'>
              {item?.amount}
            </Text>
            <Text variant={'labelSmall'} className='text-slate-400'>
              (Payment)
            </Text>
          </View>
        ) : (
          <Text variant={'bodyMedium'} className={'text-slate-400 text-center'}>
            {' '}
            -{' '}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default function Index() {
  const auth = useAuth.use?.token();
  const company = useAuthCompanyStore((state) => state.selectedCompany);
  const costCenter = useCompanyCostCenterData(
    'api/v1/get/cost-center/' + auth?.user.cost_center_id,
  );
  const { mutate: customerMutate } = useCustomersData();
  const {
    mutate: transactionsMutate,
    data: transactionsData,
    isLoading: transactionsLoading,
  } = useAllTransactions();

  const [reload, setTransactionsReload] = useState(false);

  const [filteredList, setFilteredList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptions, setShowOptions] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCostCenter, setSelectedCostCenter] = useState('');
  const [transactionType, setTransactionType] = useState(null);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [toDate, setToDate] = useState(new Date());
  function fetchCustomers() {
    const formData = new FormData();
    formData.append('cost_center_id', auth?.user.cost_center_id);
    formData.append('company_id', company?.id);
    formData.append('user_id', auth?.user.id);
    customerMutate(formData);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  function dateFormat(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function loadTransactionsData() {
    setTransactionsReload(true);

    const fromDateStr = dateFormat(fromDate);
    const toDateStr = dateFormat(toDate);

    const formData = new FormData();
    formData.append('company_id', company?.id);
    if (selectedCostCenter) {
      formData.append('cost_center_id', selectedCostCenter.id);
    } else {
      formData.append('cost_center_id', auth.user.cost_center_id);
    }
    formData.append('toDate', toDateStr);
    formData.append('fromDate', fromDateStr);
    formData.append('user_id', auth.user.id);
    transactionsMutate(formData);
    setTransactionsReload(false);
  }

  useEffect(() => {
    loadTransactionsData();
  }, [selectedCostCenter, fromDate, toDate]);

  useEffect(() => {
    loadTransactionsData();
  }, []);

  const options = [
    { label: 'Credit Given', onPress: handleClearSelection },
    {
      label: 'Payment Received',
      onPress: handleDeleteSelectedItem,
    },
    { label: 'Clear', onPress: handleEditSelectedItem },
  ];

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const handleOptionSelect = () => {
    setShowOptions((show) => !show);
  };

  useEffect(() => {
    setFilteredList(transactionsData?.data?.transactions);
  }, [transactionsData]);

  const handleSearch = (text) => {
    setQuery(text);
    // const filtered = (transactionsData?.data?.transactions).filter((item) =>
    //     item?.customer?.name?.toLowerCase().includes(text.toLowerCase())
    // );
    // setFilteredList(filtered);
  };

  const handleClearSelection = () => {
    setSelectedItem(null);
  };

  const handleDeleteSelectedItem = () => {
    const filtered = filteredList.filter((item) => item.id !== selectedItem.id);
    setFilteredList(filtered);
    setSelectedItem(null);
  };

  const handleEditSelectedItem = () => {
    setSelectedItem(null);
  };

  return (
    <View className={'bg-white flex-1'}>
      <StatusBar animated={true} />
      <View className='flex h-15 p-2 bg-blue-50'>
        <View className={'flex flex-row mb-2'}>
          <DatePickerInput
            locale='en-GB'
            label='From'
            value={fromDate}
            onChange={(d) => setFromDate(d)}
            inputMode='start'
            mode={'outlined'}
            className={'bg-blue-50 mx-1'}
          />

          <DatePickerInput
            locale='en-GB'
            label='To'
            value={toDate}
            onChange={(d) => setToDate(d)}
            inputMode='start'
            mode={'outlined'}
            className={'bg-blue-50 mx-1'}
          />
        </View>
        <View>
          {!costCenter.isLoading && costCenter?.data?.data?.length > 0 && (
            <DropDownFlashList
              data={costCenter?.data?.data}
              inputLabel='Select Cost Center'
              headerTitle='Showing list of cost-center'
              onSelect={(selectedCostCenter) => {
                setSelectedCostCenter(selectedCostCenter);
              }}
              isTransparent={true}
              filterEnabled={false}
              selectedItemName={selectedCostCenter?.name || ''}
            />
          )}
          <View className={'mt-2'} />
        </View>
        <TwoCards
          toReceive={transactionsData?.data?.totalOfTransactions?.toReceive}
          toPay={transactionsData?.data?.totalOfTransactions?.toPay}
        />
      </View>
      {transactionsData?.data ? (
        <>
          <View
            className={
              'flex flex-row justify-between w-full px-3 items-center py-4'
            }
          >
            <Searchbar
              onChangeText={handleSearch}
              value={query.toString()}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
              }}
              inputStyle={{
                fontSize: 12,
                lineHeight: Platform.OS === 'android' ? 16 : 0,
                paddingBottom: 20,
              }}
              placeholder='Search Name, Amount or Txn Note'
              className={'bg-white border-2 border-slate-200 h-10'}
            />
          </View>
          <View style={{ flex: 1, height: '100%', width: '100%' }}>
            {transactionsLoading ? (
              <ActivityIndicator />
            ) : (
              <FlashList
                data={filteredList}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                estimatedItemSize={200}
                onSearch={handleSearch}
                onSelect={handleSelect}
                selected={selectedItem}
                showOptions={showOptions}
                options={options}
                onOptionSelect={handleOptionSelect}
                ListFooterComponent={<View style={{ height: 100 }} />}
                ListEmptyComponent={
                  <View
                    className={'flex-1 d-flex justify-center items-center h-16'}
                  >
                    <Text variant={'bodyMedium'}>No Records Available!</Text>
                  </View>
                }
              />
            )}
          </View>
        </>
      ) : (
        <ActivityIndicator className={'mt-24'} />
      )}
    </View>
  );
}
